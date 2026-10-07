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

## Entry 8 — Header, Dropdown Navigation, Hero, and Slider

**Date:** October 7, 2026

### User Request

Add a header, dropdown navigation, a hero image, and a left-side carousel or slider below the fold.

### Result

Added a responsive header with a Manage dropdown, an SVG farm-and-fishery hero, and a left-side carousel showing inventory names, peso prices, available stock, and low-stock indicators. Included previous/next buttons, slide indicators, and arrow-key navigation. This layout was subsequently reverted at the user's request; the current system does not include it.

### Validation

Checked JavaScript syntax, section anchors, product display, carousel wrapping, and empty inventory handling. Visual browser review was not performed.

## Entry 9 — Revert Latest Layout Changes

**Date:** October 7, 2026

### User Request

Remove only the latest header, hero, dropdown, and slider changes (option 1).

### Result

Restored the previous sidebar and workspace layout. Preserved the red theme, starter products, Philippine peso formatting, product-selection fixes, and all system functionality. Removed the added carousel and dropdown logic and layout styles. JavaScript syntax, element references, and navigation anchors were checked.

## Entry 10 — Product Deletion Review

**Date:** October 7, 2026

### User Request

Check product deletion. Prevent deletion of products referenced by any order, including Cancelled orders, using product IDs and a clear error. Leave the code unchanged if it already works.

### Result

The existing deletion function and click handler already check every order line by product ID without excluding any status. Referenced products show: “This product is used in an order and cannot be deleted.” No files were changed during this review.

### Validation

Verified protection for Pending, Confirmed, Delivered, and Cancelled orders. Checked that blocked deletion leaves data unchanged, the Cancelled-order handler shows an error without saving, and an unreferenced product with the same name can still be deleted.

## Entry 11 — Order and Validation Bug Review

**Date:** October 7, 2026

### User Request

Review order totals, status transitions, stock deduction, cancellation restoration, and input validation. Fix confirmed bugs without unnecessary changes.

### Finding and Fix

Repeated product rows were merged when saving, which could change the total because the form rounded each row individually. For example, two 0.01 kg rows at ₱0.50/kg displayed ₱0.02 but saved as ₱0.01. Order creation now retains individual rows and original price snapshots. Stock checks still aggregate quantities by product ID, so repeated rows cannot exceed stock. Existing saved orders are unchanged.

### Validation

Passed duplicate-row totals, all 16 status-transition pairs, exact-stock boundary, combined duplicate stock limits, confirmation rechecks with unchanged data on failure, one-time deduction/restoration, Pending cancellation and delivery stock behavior, fractional totals, price snapshots, Delivered reports, Cancelled-order deletion protection, numeric/date/contact/required-input validation, JSON round trip, and JavaScript syntax checks. No additional confirmed bugs were found in the tested rules.

## Entry 12 — Interface Wording Cleanup

**Date:** October 7, 2026

### User Request

Remove unnecessary wording, including the workspace breadcrumb and browser-storage/currency banner.

### Result

Removed the workspace header labels, redundant storage/currency footer note, and assignment footer label. Shortened the product deletion note while preserving useful labels, validation messages, and business-rule guidance. No functionality changed.

## Entry 13 — Products, Orders, and Reports Tabs

**Date:** October 7, 2026

### User Request

Replace the long scrolling page with Products, Orders, and Reports tabs. Show only selected content, highlight the active tab, and keep order details in Orders.

### Result

Grouped content into three accessible tab panels with active red navigation styling. Products contains inventory and editing; Orders contains the list, creation form, and details; Reports contains the overview and sales reports. Hash navigation opens the appropriate tab for direct links and browser history. Added arrow-key/Home/End tab navigation. Existing data and business logic are unchanged.

### Validation

Verified exactly one visible panel and selected navigation button per tab, keyboard focus state, detail/create-order hash routing, unique IDs, existing control references, and JavaScript syntax.

## Entry 14 — Red Product Table Header

**Date:** October 7, 2026

### User Request

Give the entire product table header row a red background with white text, including Product, Category, Price / kg, Available stock, Stock status, and Actions. Keep the table body and functionality unchanged.

### Result

Added a CSS rule scoped to the product table header cells. All six column headers use the theme's red background and white text. The table body, HTML, and JavaScript were unchanged.

## Entry 15 — Red Controls, Filters, and Forms

**Date:** October 7, 2026

### User Request

Apply red backgrounds to the product table header, Add Product, order filters, and product/order entry forms with readable contrasting text and visible inputs. Preserve layout and functionality.

### Result

Preserved the red product table header and added matching red backgrounds to Add Product, Create order, the Buyer/Status/Date filter bar, the product editor, and the order creation form. Used white labels and input surfaces, contrasting Clear/secondary buttons, darker red submit buttons, and visible focus outlines. HTML and JavaScript were verified unchanged.

## Entry 16 — Prompt Log Update

**Date:** October 7, 2026

### User Prompt

> update prompt log

### Result

Added the missing layout creation, product deletion review, and product table header requests in chronological order. Renumbered entries and preserved the recorded results and validation limits. Only this documentation file was updated.
