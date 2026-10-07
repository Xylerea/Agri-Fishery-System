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
