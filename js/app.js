'use strict';
// Values are stored as integer hundredths (cents and hundredths of a kilogram).
const KEY = 'harvest-tide-v1';
const STARTER_PRODUCTS = [
  { id: 'starter-rice', name: 'Rice', category: 'Crop', price: 5500, stock: 10000 },
  { id: 'starter-tomato', name: 'Tomato', category: 'Crop', price: 6000, stock: 2500 },
  { id: 'starter-eggplant', name: 'Eggplant', category: 'Crop', price: 8000, stock: 1500 },
  { id: 'starter-tilapia', name: 'Tilapia', category: 'Fishery', price: 14000, stock: 1800 },
  { id: 'starter-milkfish', name: 'Milkfish', category: 'Fishery', price: 18000, stock: 3500 },
  { id: 'starter-shrimp', name: 'Shrimp', category: 'Fishery', price: 32000, stock: 1200 }
];
function addStarterProducts(data) {
  if (data.starterProductsAdded) return false;
  for (const product of STARTER_PRODUCTS) {
    const exists = data.products.some(existing => existing.id === product.id ||
      (existing.name.trim().toLowerCase() === product.name.toLowerCase() && existing.category === product.category));
    if (!exists) data.products.push({ ...product });
  }
  data.starterProductsAdded = true;
  return true;
}

const STATUSES = ['Pending', 'Confirmed', 'Delivered', 'Cancelled'];
const round = value => Math.round(value);
const totalCents = order => order.lines.reduce((sum, line) => sum + round(line.quantity * line.price / 100), 0);
function units(value, label, allowZero = false) {
  const number = Number(value);
  if (String(value).trim() === '' || !Number.isFinite(number) || number < (allowZero ? 0 : 0.01) || number > 1000000 || Math.abs(number * 100 - round(number * 100)) > 0.000001) throw Error(label + ' must be a valid number with up to two decimals.');
  return round(number * 100);
}
function requireText(value, label) {
  if (!String(value).trim()) throw Error(label + ' is required.');
  return String(value).trim();
}
function checkStock(data, lines) {
  const needed = new Map();
  for (const line of lines) {
    if (!Number.isSafeInteger(line.quantity) || line.quantity <= 0) throw Error('Enter a positive quantity.');
    needed.set(line.productId, (needed.get(line.productId) || 0) + line.quantity);
  }
  for (const [id, quantity] of needed) {
    const product = data.products.find(p => p.id === id);
    if (!product) throw Error('A selected product no longer exists.');
    if (quantity > product.stock) throw Error(product.name + ': requested quantity exceeds available stock (' + (product.stock / 100).toFixed(2) + ' kg).');
  }
  return needed;
}
function createOrder(data, input, id) {
  const buyer = requireText(input.buyer, 'Buyer name');
  const contact = requireText(input.contact, 'Contact number');
  if (!/^[+()\d\s.-]{6,30}$/.test(contact) || contact.replace(/\D/g, '').length < 6) throw Error('Enter a contact number with at least six digits.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || !Number.isFinite(Date.parse(input.date)) || new Date(input.date).toISOString().slice(0, 10) !== input.date) throw Error('Enter a valid order date.');
  if (!input.lines.length) throw Error('Select at least one product.');
  const needed = checkStock(data, input.lines);
  const lines = [...needed].map(([productId, quantity]) => {
    const product = data.products.find(p => p.id === productId);
    return { productId, name: product.name, price: product.price, quantity };
  });
  data.orders.push({ id, buyer, contact, date: input.date, status: 'Pending', lines });
}
function transition(data, id, next) {
  const order = data.orders.find(o => o.id === id);
  if (!order) throw Error('Order not found.');
  const allowed = { Pending: ['Confirmed', 'Cancelled'], Confirmed: ['Delivered', 'Cancelled'], Delivered: [], Cancelled: [] };
  if (!allowed[order.status].includes(next)) throw Error('This status change is not allowed.');
  if (next === 'Confirmed') {
    const needed = checkStock(data, order.lines);
    for (const [productId, quantity] of needed) data.products.find(p => p.id === productId).stock -= quantity;
  } else if (order.status === 'Confirmed' && next === 'Cancelled') {
    for (const line of order.lines) {
      const product = data.products.find(p => p.id === line.productId);
      if (!product) throw Error('Cannot restore stock: product missing.');
      product.stock += line.quantity;
    }
  }
  order.status = next;
}
function deleteProduct(data, id) {
  if (data.orders.some(o => o.lines.some(l => l.productId === id))) throw Error('This product is used in an order and cannot be deleted.');
  data.products = data.products.filter(p => p.id !== id);
}
function reports(data) {
  const counts = Object.fromEntries(STATUSES.map(s => [s, data.orders.filter(o => o.status === s).length]));
  const delivered = data.orders.filter(o => o.status === 'Delivered');
  const sold = new Map();
  for (const order of delivered) for (const line of order.lines) sold.set(line.productId, (sold.get(line.productId) || 0) + line.quantity);
  const max = Math.max(0, ...sold.values());
  const top = [...sold].filter(([,quantity]) => quantity === max).map(([id, quantity]) => ({ name: data.products.find(p => p.id === id)?.name || 'Product', quantity }));
  return { counts, sales: delivered.reduce((sum, o) => sum + totalCents(o), 0), kilograms: [...sold.values()].reduce((sum, q) => sum + q, 0), top };
}
function validateData(data) {
  if (!data || !Array.isArray(data.products) || !Array.isArray(data.orders)) throw Error('Invalid stored data.');
  const ids = new Set();
  for (const p of data.products) {
    if (typeof p.id !== 'string' || ids.has(p.id) || typeof p.name !== 'string' || !p.name.trim() || !['Crop', 'Fishery'].includes(p.category) || !Number.isSafeInteger(p.price) || p.price <= 0 || !Number.isSafeInteger(p.stock) || p.stock < 0) throw Error('Invalid stored product.');
    ids.add(p.id);
  }
  const orderIds = new Set();
  for (const o of data.orders) {
    if (typeof o.id !== 'string' || orderIds.has(o.id) || typeof o.buyer !== 'string' || typeof o.contact !== 'string' || typeof o.date !== 'string' || !STATUSES.includes(o.status) || !Array.isArray(o.lines) || !o.lines.length) throw Error('Invalid stored order.');
    orderIds.add(o.id);
    for (const l of o.lines) if (!ids.has(l.productId) || typeof l.name !== 'string' || !Number.isSafeInteger(l.price) || l.price <= 0 || !Number.isSafeInteger(l.quantity) || l.quantity <= 0) throw Error('Invalid stored order line.');
  }
  return data;
}
if (typeof document !== 'undefined') {
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = cents => '₱' + (cents / 100).toLocaleString('en-PH', {minimumFractionDigits:2, maximumFractionDigits:2});
  const kg = value => (value / 100).toLocaleString(undefined, {maximumFractionDigits:2});
  const badge = status => '<span class="badge ' + ({Pending:'pending',Confirmed:'confirmed',Delivered:'healthy',Cancelled:'cancelled'}[status]) + '">' + status + '</span>';
  const uid = prefix => prefix + '-' + (globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2));
  let data = {products: [], orders: []}, selected = null, blocked = false;
  function message(text, error = false) { $('message').hidden = false; $('message').className = error ? 'feedback error' : 'feedback success'; $('message').textContent = text; }
  try {
    const saved = localStorage.getItem(KEY);
    const loaded = saved ? validateData(JSON.parse(saved)) : { products: [], orders: [] };
    if (addStarterProducts(loaded)) localStorage.setItem(KEY, JSON.stringify(loaded));
    data = loaded;
  }
  catch (error) { blocked = true; message('Stored data could not be loaded. Changes are blocked to protect existing data. ' + error.message, true); }
  function commit(change, success) {
    try {
      if (blocked) throw Error('Storage is unavailable or contains invalid data. Existing data has not been overwritten.');
      const candidate = JSON.parse(JSON.stringify(data));
      change(candidate); validateData(candidate);
      localStorage.setItem(KEY, JSON.stringify(candidate));
      data = candidate; render(); message(success); return true;
    } catch (error) { message(error.message, true); return false; }
  }
  function renderProducts() {
    const list = data.products.filter(p => !$('category-filter').value || p.category === $('category-filter').value);
    $('product-count').textContent = list.length;
    $('product-rows').innerHTML = list.map(p => '<tr><td><span class="product-symbol ' + (p.category === 'Crop' ? 'crop' : 'fish') + '">' + escape(p.name.charAt(0).toUpperCase()) + '</span><strong>' + escape(p.name) + '</strong></td><td>' + p.category + '</td><td>' + money(p.price) + '</td><td>' + kg(p.stock) + ' kg</td><td><span class="badge ' + (p.stock < 2000 ? 'low' : 'healthy') + '">' + (p.stock < 2000 ? 'LOW STOCK' : 'In stock') + '</span></td><td><button data-edit="' + escape(p.id) + '">Edit</button> <button data-delete="' + escape(p.id) + '">Delete</button></td></tr>').join('') || '<tr><td colspan="6" class="empty">No products found. Add a product to get started.</td></tr>';
  }
  function renderOrders() {
    const buyer = $('buyer-filter').value.trim().toLowerCase(), status = $('status-filter').value, date = $('date-filter').value;
    const list = data.orders.filter(o => o.buyer.toLowerCase().includes(buyer) && (!status || o.status === status) && (!date || o.date === date));
    $('order-rows').innerHTML = [...list].reverse().map(o => '<tr><td>' + escape(o.id.slice(0, 14)) + '</td><td>' + escape(o.buyer) + '</td><td>' + escape(o.date) + '</td><td>' + money(totalCents(o)) + '</td><td>' + badge(o.status) + '</td><td><button data-view="' + escape(o.id) + '">View order →</button></td></tr>').join('') || '<tr><td colspan="6" class="empty">No matching orders.</td></tr>';
  }
  function renderDetail() {
    const o = data.orders.find(o => o.id === selected);
    if (!o) { $('detail-content').innerHTML = '<p class="muted">Select an order to view its details.</p>'; return; }
    const buttons = o.status === 'Pending' ? ['Confirmed', 'Cancelled'] : o.status === 'Confirmed' ? ['Delivered', 'Cancelled'] : [];
    $('detail-content').innerHTML = '<div class="section-heading"><strong>' + escape(o.id.slice(0,14)) + '</strong>' + badge(o.status) + '</div><div class="buyer-details"><strong>' + escape(o.buyer) + '</strong><p>Contact: ' + escape(o.contact) + '</p><p>Order date: ' + escape(o.date) + '</p></div><div class="table-wrap"><table><thead><tr><th>Product</th><th>Kg</th><th>Price / kg</th><th>Total</th></tr></thead><tbody>' + o.lines.map(l => '<tr><td>' + escape(l.name) + '</td><td>' + kg(l.quantity) + '</td><td>' + money(l.price) + '</td><td>' + money(round(l.quantity*l.price/100)) + '</td></tr>').join('') + '</tbody></table></div><div class="total"><span>Order total</span><strong>' + money(totalCents(o)) + '</strong></div><p class="helper">' + (o.status === 'Pending' ? 'Confirming deducts stock. Cancelling a pending order does not affect stock.' : o.status === 'Confirmed' ? 'Stock has been deducted. Cancellation restores stock; delivery makes no further deduction.' : 'This order is final. No further status changes are allowed.') + '</p><div class="actions">' + buttons.map(s => '<button class="button ' + (s === 'Cancelled' ? 'danger' : 'primary') + '" data-status="' + s + '">' + ({Confirmed:'Confirm order',Delivered:'Mark delivered',Cancelled:'Cancel order'}[s]) + '</button>').join('') + '</div>';
  }
  function renderSummary() {
    const r = reports(data), low = data.products.filter(p => p.stock < 2000);
    $('stats').innerHTML = [['Delivered sales',money(r.sales),'From ' + r.counts.Delivered + ' delivered orders'],['Active orders',r.counts.Pending+r.counts.Confirmed,r.counts.Pending+' pending · '+r.counts.Confirmed+' confirmed'],['Available inventory',kg(data.products.reduce((s,p)=>s+p.stock,0))+' kg','Across '+data.products.length+' products'],['Low-stock products',low.length,'Below the 20 kg threshold']].map((a,i)=>'<article class="stat '+(i===3?'warning':'')+'"><span>'+a[0]+'</span><strong>'+a[1]+'</strong><p>'+a[2]+'</p></article>').join('');
    $('stock-notice').innerHTML = '<span class="notice-icon">!</span><div><strong>' + (low.length ? 'Review low-stock products' : 'Inventory overview') + '</strong><p>' + (low.length ? low.map(p=>escape(p.name)+' ('+kg(p.stock)+' kg)').join(', ') : data.products.length ? 'All products have at least 20 kg available.' : 'Add products to begin tracking your inventory.') + '</p></div><a href="#products">View inventory →</a>';
    $('report-content').innerHTML = '<article class="panel padded sales-report"><span class="eyebrow">DELIVERED SALES</span><strong class="report-number">'+money(r.sales)+'</strong><p class="muted">'+r.counts.Delivered+' delivered orders · '+kg(r.kilograms)+' kg sold</p></article><article class="panel padded"><h3>Orders by status</h3>'+STATUSES.map(s=>'<div class="status-row"><span>'+badge(s)+'</span><strong>'+r.counts[s]+'</strong></div>').join('')+'</article><article class="panel padded top-product"><span class="eyebrow">MOST KILOGRAMS SOLD</span><h3>'+ (r.top.length ? r.top.map(p=>escape(p.name)).join(' · ') : 'No delivered sales yet') +'</h3><strong class="report-number">'+(r.top.length ? kg(r.top[0].quantity)+' kg' : '—')+'</strong><p class="muted">'+(r.top.length>1?'Tied for most kilograms sold':'From Delivered orders')+'</p></article>';
  }
  function populateProductOptions(select) {
    const previous = select.value;
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = data.products.length ? 'Select product' : 'Add inventory products first';
    const options = data.products.map(product => {
      const option = document.createElement('option');
      option.value = product.id;
      option.textContent = product.name + ' · ' + kg(product.stock) + ' kg available';
      return option;
    });
    select.replaceChildren(placeholder, ...options);
    select.value = data.products.some(product => product.id === previous) ? previous : '';
  }
  function updateOptions() {
    document.querySelectorAll('.line-product').forEach(populateProductOptions);
  }
  function updateDraft() {
    let total = 0;
    for (const row of document.querySelectorAll('.order-line')) {
      const product = data.products.find(product => product.id === row.querySelector('.line-product').value);
      const quantity = Number(row.querySelector('.line-quantity').value);
      const cents = product && Number.isFinite(quantity) && quantity > 0
        ? round(round(quantity * 100) * product.price / 100) : 0;
      row.querySelector('output').textContent = money(cents);
      row.querySelector('.selected-product').textContent = product
        ? product.name + ' · ' + money(product.price) + '/kg · ' + kg(product.stock) + ' kg available'
        : 'Choose a product for this row.';
      total += cents;
    }
    $('draft-total').textContent = money(total);
  }
  function addLine() {
    const row = document.createElement('div');
    row.className = 'order-line';
    row.innerHTML = '<label class="product-choice">Product<select class="line-product" required></select><span class="selected-product" aria-live="polite">Choose a product for this row.</span></label><label>Quantity (kg)<input class="line-quantity" type="number" min="0.01" max="1000000" step="0.01" required></label><label>Line total<output>₱0.00</output></label><button type="button" class="button secondary remove-line">Remove</button>';
    populateProductOptions(row.querySelector('.line-product'));
    $('order-lines').append(row);
    updateDraft();
    return row;
  }
  function render() { renderProducts(); renderOrders(); renderDetail(); renderSummary(); updateOptions(); updateDraft(); }
  function resetProduct() { $('product-editor').reset(); $('product-id').value = ''; }
  $('add-product').onclick = () => { resetProduct(); $('product-form').open = true; $('product-form').scrollIntoView(); $('product-name').focus(); };
  $('cancel-edit').onclick = () => { resetProduct(); $('product-form').open = false; };
  $('product-editor').onsubmit = event => {
    event.preventDefault();
    try {
      const id = $('product-id').value || uid('P');
      const product = {id, name:requireText($('product-name').value,'Product name'), category:$('product-category').value, price:units($('product-price').value,'Price'), stock:units($('product-stock').value,'Stock',true)};
      if (commit(next => { const index=next.products.findIndex(p=>p.id===id); if(index<0) next.products.push(product); else next.products[index]=product; }, 'Product saved.')) { resetProduct(); $('product-form').open = false; }
    } catch(error) {message(error.message,true);}
  };
  $('product-rows').onclick = event => {
    const edit = event.target.closest('[data-edit]'), del = event.target.closest('[data-delete]');
    if(edit) { const p=data.products.find(p=>p.id===edit.dataset.edit); $('product-id').value=p.id; $('product-name').value=p.name; $('product-category').value=p.category; $('product-price').value=(p.price/100).toFixed(2); $('product-stock').value=(p.stock/100).toFixed(2); $('product-form').open=true; $('product-form').scrollIntoView(); }
    if(del) { const p=data.products.find(p=>p.id===del.dataset.delete); if(data.orders.some(o=>o.lines.some(l=>l.productId===p.id))) {message('This product is used in an order and cannot be deleted.',true);return;} if(confirm('Delete '+p.name+'?')) commit(next=>deleteProduct(next,p.id),'Product deleted.'); }
  };
  $('category-filter').onchange=renderProducts;
  for(const id of ['buyer-filter','status-filter','date-filter']) $(id).addEventListener('input',renderOrders);
  $('clear-filters').onclick=()=>{for(const id of ['buyer-filter','status-filter','date-filter']) $(id).value='';renderOrders();};
  $('order-rows').onclick=event=>{const button=event.target.closest('[data-view]');if(button){selected=button.dataset.view;renderDetail();$('order-detail').scrollIntoView();}};
  $('detail-content').onclick=event=>{const button=event.target.closest('[data-status]');if(button){if(button.dataset.status==='Cancelled'&&!confirm('Cancel this order? Confirmed stock will be restored.'))return;commit(next=>transition(next,selected,button.dataset.status),'Order '+button.dataset.status.toLowerCase()+'.');}};
  $('add-line').onclick = () => {
    const row = addLine();
    row.querySelector('.line-product').focus();
  };
  $('order-lines').addEventListener('input',updateDraft);
  $('order-lines').addEventListener('change',updateDraft);
  $('order-lines').onclick=event=>{if(event.target.closest('.remove-line')){if($('order-lines').children.length===1){message('An order needs at least one product line.',true);return;}event.target.closest('.order-line').remove();updateDraft();}};
  function today() { const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  $('order-date').value=today();
  $('order-editor').onsubmit=event=>{
    event.preventDefault();
    try {
      const input={buyer:$('order-buyer').value,contact:$('order-contact').value,date:$('order-date').value,lines:[...document.querySelectorAll('.order-line')].map(row=>({productId:row.querySelector('select').value,quantity:units(row.querySelector('input').value,'Quantity')}))};
      const id=uid('ORD');
      if(commit(next=>createOrder(next,input,id),'Pending order created. Stock will be deducted on confirmation.')) {selected=id;$('order-editor').reset();$('order-date').value=today();$('order-lines').replaceChildren();addLine();renderDetail();$('order-detail').scrollIntoView();}
    } catch(error) {message(error.message,true);}
  };
  window.addEventListener('storage', event=>{if(event.key===KEY){try{data=event.newValue?validateData(JSON.parse(event.newValue)):{products:[],orders:[]};blocked=false;render();message('Data updated from another tab.');}catch(error){blocked=true;message('Another tab saved invalid data. Changes are blocked.',true);}}});
  addLine();render();
}
