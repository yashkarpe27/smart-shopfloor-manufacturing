frappe.pages['shop-floor-scanner'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Factory Barcode Scanner',
        single_column: true
    });

    // 1. Create the input field for the barcode (Work Order Number)
    let barcode_field = page.add_field({
        label: 'Scan Work Order Barcode',
        fieldtype: 'Data',
        fieldname: 'work_order_barcode',
        reqd: 1
    });

    // 2. Add a Primary Button to trigger the backend API
    page.set_primary_action('Process Batch', () => {
        let work_order = barcode_field.get_value();
        
        if (!work_order) {
            frappe.msgprint({
                title: __('Error'),
                indicator: 'red',
                message: __('Please scan a barcode first.')
            });
            return;
        }

        // We will write this Python backend function in the next step!
        frappe.call({
            method: "shopfloor.shopfloor.page.shop_floor_scanner.shop_floor_scanner.process_barcode",
            args: {
                work_order: work_order
            },
            callback: function(r) {
                if (!r.exc) {
                    frappe.show_alert({message: __('Manufacture Stock Entry Created!'), indicator: 'green'});
                    barcode_field.set_value(''); // Clear the input for the next scan
                }
            }
        });
    });

    // 3. Add some basic HTML instructions to the page body
    $(frappe.render_template(`
        <div style="padding: 30px; text-align: center; margin-top: 50px;">
            <svg class="icon icon-xl" style="width: 80px; height: 80px; margin-bottom: 20px;">
                <use href="#icon-barcode"></use>
            </svg>
            <h2>Awaiting Scan...</h2>
            <p class="text-muted">Scan the Work Order traveler document to instantly backflush materials and log finished goods.</p>
        </div>
    `)).appendTo(page.main);
}