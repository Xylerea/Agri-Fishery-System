# Requirements Analysis

## Project

IT415 Midterm — Scenario 3: Agri-Fishery Cooperative Order and Inventory System.

## Current Scope

Requirements documentation and a responsive interface design with illustrative sample data. Core functionality, live calculations, stock adjustments, filtering, and localStorage persistence have not been implemented.

## 1. Problem

The cooperative takes orders through text messages and records stock in a notebook. This causes orders to exceed available stock and stock not to be restored when confirmed orders are cancelled.

## 2. Target Users

Cooperative staff who manage products, inventory, orders, and sales.

## 3. Functional Requirements

- Add, edit, and delete products, but prevent deletion of products used in orders.
- Create orders with product quantities in kilograms and calculate line totals and the order total.
- Prevent orders from exceeding available stock.
- Allow the status progression Pending → Confirmed → Delivered. Allow Pending or Confirmed orders to become Cancelled.
- Deduct stock when an order is Confirmed and restore it when a Confirmed order is Cancelled.
- Display LOW STOCK for products with stock below 20 kg.
- Search or filter orders by buyer, status, or date, and filter products by category.
- Report Delivered-only sales, order counts per status, and the product with the most kilograms sold.
- Preserve data after refreshing using localStorage.

### Order Status and Stock Rules

| Status transition | Stock effect |
| --- | --- |
| New order → Pending | No stock deduction |
| Pending → Confirmed | Deduct ordered quantities |
| Confirmed → Delivered | No additional stock deduction |
| Pending → Cancelled | No stock restoration needed |
| Confirmed → Cancelled | Restore previously deducted quantities |

Available stock must be checked during order creation and checked again before confirmation, because other orders may have consumed stock in the meantime. Each confirmation deduction or cancellation restoration must occur only once. Delivered and Cancelled are final statuses under the specified workflow.

### Calculations

- Line total = quantity in kilograms × price per kilogram.
- Order total = sum of all line totals.
- Sales total = sum of totals for Delivered orders only.
- Order count per status = number of orders with that status.
- Top-selling product = product with the largest total kilograms in Delivered orders.
- LOW STOCK applies when stock is less than 20 kg; exactly 20 kg does not qualify.

## 4. Required Inputs

| Area | Inputs |
| --- | --- |
| Product | Product name, category (Crop or Fishery), price per kilogram, stock in kilograms |
| Order | Buyer name, contact number, order date, selected products, quantities in kilograms |
| Status management | Requested order status change |

## 5. Expected Outputs

- A product list with low-stock indicators.
- An order list.
- An order detail page with calculated line totals and order total.
- Sales reports showing Delivered-only sales, order counts per status, and the product with the most kilograms sold.
- Clear success or error messages.

## 6. Proposed Features

- Product management.
- Order creation and order details.
- Status management and automatic stock adjustment.
- Low-stock alerts.
- Order search and filters, and product category filters.
- Sales reports.
- Browser data storage.

## 7. Tools and Technologies

| Tool or technology | Purpose |
| --- | --- |
| HTML | Page structure |
| CSS | Styling |
| JavaScript | Application logic |
| localStorage | Browser data storage |
| VS Code | Development |
| Git and GitHub | Version control and pull requests |
| ChatGPT | Development assistance |

## 8. Acceptance Checks for Future Implementation

- A product referenced by an order cannot be deleted.
- Order line totals and the order total match the entered quantities and prices.
- An order cannot exceed available stock at creation or confirmation.
- Only the specified status transitions are accepted.
- Confirmation deducts stock once; cancellation of a Confirmed order restores it once.
- Cancellation of a Pending order and delivery of a Confirmed order do not change stock.
- A product below 20 kg shows LOW STOCK; a product at 20 kg does not.
- Buyer, status, date, and category searches or filters return matching records.
- Sales and kilograms-sold rankings include only Delivered orders; status counts include all orders.
- Products, orders, and stock adjustments remain available after refreshing.

## 9. Details to Resolve Before Implementation

The provided requirements do not specify currency and rounding rules, contact-number format, permitted quantity precision, whether existing orders keep their original prices after product edits, or how to display ties for the top-selling product. These details remain open.
