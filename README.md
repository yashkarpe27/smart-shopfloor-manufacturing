# Smart Shop-Floor Barcode Scanner (ERPNext MES Integration)

A custom Manufacturing Execution System (MES) application built on the Frappe Framework designed to automate the Work Order completion process in ERPNext. This application replaces manual, multi-click data entry with a hardware-friendly barcode scanning interface, enabling factory floor workers to log finished goods in a single scan.

## 🏭 The Business Problem
In standard manufacturing environments, operators must navigate complex ERP screens to log completed Work Orders, create Stock Entries, and backflush materials. This manual overhead leads to:
* Delayed, end-of-shift data entry resulting in outdated inventory balances.
* Human error in raw material consumption and warehouse routing.
* Disconnects between physical shop-floor activity and General Ledger accounting.

## 🚀 The Solution
This custom application bridges the physical factory floor with the backend ERP database. By scanning a barcode on a Work Order traveler document, the system instantly:
1. Validates the Work Order status and ensures prior operations (Job Cards) are complete.
2. Programmatically executes a "Manufacture" Stock Entry (backflushing).
3. Deducts consumed raw materials from the Work-In-Progress (WIP) warehouse.
4. Books the final product into the Finished Goods warehouse.
5. Updates the General Ledger with the exact financial valuation, including labor and machine overhead costs.

## 🛠️ Technical Architecture & Stack

### Frontend (Client-Side)
* **Custom Frappe Page:** Developed a clean, distraction-free UI using JavaScript, HTML, and CSS tailored specifically for hardware barcode scanners.
* **Asynchronous Routing:** Utilizes `frappe.call` to securely pass scanned inputs to the backend API without page reloads.

### Backend (Server-Side)
* **Python API:** Custom controller logic utilizing Frappe's `@frappe.whitelist()` decorator for secure endpoint exposure.
* **Frappe ORM & Business Logic:** Extensive use of `frappe.get_doc` and `frappe.db` to enforce strict validation rules (preventing double-manufacturing and un-submitted states).
* **Core ERPNext Integration:** Programmatic execution of ERPNext's native `make_stock_entry` function to ensure all standard business logic and accounting rules are respected.

### Financial & Inventory Compliance
* **Perpetual Inventory Integration:** Automatically routes costs through the correct Company Default Accounts (WIP, Stock In Hand, and Manufacturing Operating Costs).
* **Automated Costing:** Captures and merges BOM (Bill of Materials) raw material costs with Job Card operational overheads into a single ledger transaction.

## 💻 Installation

To install this custom application on an existing Frappe Bench:

```bash
# Fetch the app from GitHub
bench get-app [https://github.com/yashkarpe27/smart-shopfloor-manufacturing.git](https://github.com/yashkarpe27/smart-shopfloor-manufacturing.git)

# Install the app on your specific site
bench --site [your-site-name] install-app shopfloor

# Migrate and build assets
bench --site [your-site-name] migrate
bench build
