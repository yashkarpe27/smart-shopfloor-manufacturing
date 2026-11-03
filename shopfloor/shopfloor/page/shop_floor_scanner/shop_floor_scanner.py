import frappe
from frappe.utils import flt

@frappe.whitelist()
def process_barcode(work_order):
    # validate scanned work order exists
    if not frappe.db.exists('Work Order', work_order):
        frappe.throw(f'Barcode Error: Work Order {work_order} does not exist.')
    
    wo = frappe.get_doc('Work Order', work_order)

    # check status for duplicate manufacturing
    if wo.docstatus != 1:
        frappe.throw(f'Work Order {work_order} is not submitted.')
    
    if wo.status == 'Completed':
        frappe.throw(f'Work Order {work_order} is already fully manufactured.')
    
    # Call the core ERPNext function used by the standard "Create > Manufacture" button
    stock_entry_dict = frappe.call(
        'erpnext.manufacturing.doctype.work_order.work_order.make_stock_entry',
        work_order_id = wo.name,
        purpose = 'Manufacture',
        qty = wo.qty - flt(wo.produced_qty)
    )

    # Save and permanently submit the new stock entry
    se = frappe.get_doc(stock_entry_dict)
    se.insert()
    se.submit()

    return se.name