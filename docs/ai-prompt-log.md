# AI Prompt Log

## Entry 1 — Initial Project Setup

**Date:** October 7, 2026

### User Prompt

```text
Help me complete only the initial project setup for my IT415 midterm:
Scenario 3 — Agri-Fishery Cooperative Order and Inventory System.

Use this file structure:
index.html
css/style.css
js/app.js
docs/requirements-analysis.md
docs/ai-prompt-log.md

Keep index.html, css/style.css, and js/app.js empty for now.
Do not build the interface or functionality yet.
```

### Result

Created the requested file structure with empty HTML, CSS, and JavaScript files, a requirements analysis starter, and this prompt log. No interface or functionality was built.

## Entry 2 — System Requirements

**Date:** October 7, 2026

### User-Provided Requirements

The user supplied the following system details:

1. **Problem:** Orders are taken through text messages and stock is recorded in a notebook, causing orders to exceed stock and missing stock restoration after confirmed-order cancellations.
2. **Target users:** Staff managing products, inventory, orders, and sales.
3. **Functional requirements:** Product CRUD with deletion protection for products used in orders; kilogram-based orders and calculated totals; stock limits; Pending → Confirmed → Delivered status progression; cancellation from Pending or Confirmed; stock deduction on confirmation and restoration on cancellation of Confirmed orders; LOW STOCK below 20 kg; buyer/status/date order search and filtering; category product filtering; Delivered-only sales, counts per status, and top product by kilograms sold; localStorage persistence.
4. **Required inputs:** Product name, Crop or Fishery category, price per kilogram, stock in kilograms, buyer name, contact number, order date, selected products, quantities, and status changes.
5. **Expected outputs:** Product list with low-stock indicators, order list, order detail page with calculated totals, sales reports, and clear success or error messages.
6. **Proposed features:** Product management, order creation and details, status management, automatic stock adjustment, low-stock alerts, search and filters, sales reports, and browser data storage.
7. **Tools and technologies:** HTML, CSS, JavaScript, localStorage, VS Code, Git, GitHub, and ChatGPT.

### Result

Updated requirements-analysis.md with the provided details, stock-transition rules, calculations, acceptance checks for future implementation, and unresolved specification details. Kept index.html, css/style.css, and js/app.js empty. No interface or functionality was built.

## Entry 3 — Interface Design

**Date:** October 7, 2026

### User Prompt

> now help me design the system with following details of the system.

### Result

Created a responsive HTML/CSS interface for overview, products and inventory, orders, order creation, order details, and sales reports using the documented requirements. Included sample data, low-stock and status indicators, input layouts, stock-rule guidance, and disabled management controls. Navigation links and the product-form disclosure work through native HTML. Used illustrative currency units because currency is not specified. JavaScript remains empty; business logic and localStorage are not implemented.

## Entry 4 — Red Theme

**Date:** October 7, 2026

### User Prompt

> can u make the color red theme

### Result

Updated the interface with crimson accents, pale rose backgrounds, and warm neutral text and borders. Applied the theme to navigation, branding, buttons, focus outlines, notices, and report graphics. Preserved distinct stock and order-status colors and the existing layout.

## Entry 5 — Full Functionality

**Date:** October 7, 2026

### User Prompt

> now, add all the functionalities i provided

### Result

Implemented product add/edit/delete with order-reference protection; multi-product orders with kilogram quantities and live totals; stock checks during creation and confirmation; Pending → Confirmed → Delivered and Pending/Confirmed → Cancelled transitions; one-time stock deduction and restoration; LOW STOCK below 20 kg; buyer/status/date order filters and category product filter; order details; Delivered-only sales and kilograms rankings including ties; counts for all statuses; validation and success/error messages; localStorage persistence. Removed illustrative records and initialized empty data for first use. Preserved the red theme. Documented currency, precision, contact, and price-snapshot choices.

### Validation

Passed business-rule tests and DOM-harness integration checks for data entry, status changes, filters, reports, persistence/reload, escaped text, storage-failure rollback, and element references. A real-browser visual test was not run because browser-testing dependencies were unavailable.

## Entry 6 — Order Product Selection Fix

**Date:** October 7, 2026

### User Request

Fix Add Product so it creates a selectable order row, and ensure selected products are visible.

### Result

Changed order Add Product to append and focus a new row without rebuilding earlier dropdowns. Added explicit product-name, price, and available-stock details beneath each selection. Preserved selections when inventory options refresh and adjusted row sizing for readable dropdowns. Product catalog Add product continues to open the inventory editor.

### Validation

A focused selection test harness verified multiple row creation, preservation of earlier selections, visible chosen-product names, updated inventory names, line totals, and combined totals. JavaScript syntax validation passed.

## Entry 7 — Starter Products and Philippine Peso

**Date:** October 7, 2026

### User Request

Add products with categories, prices, available stock, stock status, and actions. Replace CU currency units with the peso sign.

### Result

Added Rice, Tomato, Eggplant, Tilapia, Milkfish, and Shrimp as a one-time starter inventory. Existing products with matching names/categories are preserved; deleted starter products do not reappear after refresh. Products display category, peso price per kilogram, available kilograms, stock status, and working Edit/Delete actions. Replaced all application CU displays with Philippine pesos (₱), including forms, order lines, totals, and sales reports.

### Validation

Verified six starter products, three LOW STOCK items, no duplicates on repeated initialization, preservation of existing stock/prices, no resurrection after deletion, valid stored data, peso formatting, and removal of CU from HTML/JavaScript.
