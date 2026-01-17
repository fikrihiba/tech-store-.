// ===============================
// SPA Navigation
// ===============================
const sections = document.querySelectorAll('.section');
const sidebarItems = document.querySelectorAll('.sidebar li');
const sectionTitle = document.getElementById('section-title');

sidebarItems.forEach(item => {
  item.addEventListener('click', () => {
    sidebarItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(item.dataset.section).classList.add('active');

    sectionTitle.textContent = item.textContent.trim();
  });
});

// ===============================
// LocalStorage
// ===============================
const LS_PRODUCTS = "smart_dashboard_products";
const LS_CATEGORIES = "smart_dashboard_categories";

let products = JSON.parse(localStorage.getItem(LS_PRODUCTS)) || [];
let categories = JSON.parse(localStorage.getItem(LS_CATEGORIES)) || [];

// ===============================
// Elements
// ===============================
const productForm = document.getElementById('product-form');
const productTableBody = document.querySelector('#product-table tbody');
const searchInput = document.getElementById('search-product');
const filterCategory = document.getElementById('filter-category');
const emptyProducts = document.getElementById('empty-products');

const categoryForm = document.getElementById('category-form');
const categoryList = document.getElementById('category-list');

const sortNameBtn = document.getElementById('sort-name');
const sortPriceBtn = document.getElementById('sort-price');

// ===============================
// Utils
// ===============================
function saveAll() {
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(products));
  localStorage.setItem(LS_CATEGORIES, JSON.stringify(categories));
}

function formatMoney(v) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(v);
}

// ===============================
// DÉTAILS PRODUIT
// ===============================
function showProductDetails(p) {
  document.getElementById('detail-name').textContent = p.name;
  document.getElementById('detail-price').textContent = formatMoney(p.price);
  document.getElementById('detail-category').textContent = p.category;
  document.getElementById('product-details').style.display = "block";
}

// ===============================
// KPI
// ===============================
function updateKPIs() {
  document.getElementById('kpi-products').textContent = products.length;
  document.getElementById('kpi-categories').textContent = categories.length;
  document.getElementById('kpi-stock').textContent =
    formatMoney(products.reduce((s, p) => s + p.price, 0));
}

// ===============================
// Render Products
// ===============================
function renderProducts() {
  const term = searchInput.value.toLowerCase();
  const cat = filterCategory.value;

  const list = products.filter(p =>
    p.name.toLowerCase().includes(term) &&
    (!cat || p.category === cat)
  );

  productTableBody.innerHTML = "";

  list.forEach(p => {
    const index = products.indexOf(p);
    const tr = document.createElement('tr');

    tr.addEventListener('click', () => showProductDetails(p));

    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${formatMoney(p.price)}</td>
      <td>${p.category}</td>
      <td>
        <button onclick="editProduct(${index}); event.stopPropagation()">Modifier</button>
        <button onclick="deleteProduct(${index}); event.stopPropagation()">Supprimer</button>
      </td>
    `;
    productTableBody.appendChild(tr);
  });

  emptyProducts.style.display = products.length ? "none" : "flex";

  updateKPIs();
  updateChart();
}

// ===============================
// Add Product
// ===============================
productForm.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('product-name').value.trim();
  const price = parseFloat(document.getElementById('product-price').value);
  const category = document.getElementById('product-category').value.trim();

  products.push({ name, price, category });

  if (!categories.includes(category)) {
    categories.push(category);
  }

  saveAll();
  renderProducts();
  renderCategories();
  productForm.reset();
});

// ===============================
// Edit / Delete
// ===============================
window.deleteProduct = index => {
  if (confirm("Supprimer ce produit ?")) {
    products.splice(index, 1);
    document.getElementById('product-details').style.display = "none";
    saveAll();
    renderProducts();
    renderCategories();
  }
};

window.editProduct = index => {
  const p = products[index];

  const name = prompt("Nom", p.name);
  const price = prompt("Prix", p.price);
  const category = prompt("Catégorie", p.category);

  if (name && price && category) {
    products[index] = {
      name: name.trim(),
      price: parseFloat(price),
      category: category.trim()
    };
    saveAll();
    renderProducts();
    renderCategories();
  }
};

// ===============================
// Categories
// ===============================
function renderCategories() {
  categoryList.innerHTML = "";

  categories.forEach((c, i) => {
    const li = document.createElement('li');
    li.innerHTML = `${c} <button onclick="deleteCategory(${i})">Supprimer</button>`;
    categoryList.appendChild(li);
  });

  filterCategory.innerHTML =
    `<option value="">Toutes les catégories</option>` +
    categories.map(c => `<option value="${c}">${c}</option>`).join("");
}

window.deleteCategory = i => {
  categories.splice(i, 1);
  saveAll();
  renderCategories();
  renderProducts();
};

// ===============================
// Chart.js
// ===============================
const chart = new Chart(document.getElementById('chart-products'), {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{ label: 'Produits par catégorie', data: [] }]
  },
  options: { responsive: true }
});

function updateChart() {
  const counts = {};
  products.forEach(p => counts[p.category] = (counts[p.category] || 0) + 1);
  chart.data.labels = Object.keys(counts);
  chart.data.datasets[0].data = Object.values(counts);
  chart.update();
}

// ===============================
// FETCH API PRODUITS RÉELS
// ===============================
async function loadProductsFromAPI() {
  try {
    const res = await fetch('https://dummyjson.com/products/category/laptops'); // Exemple catégorie tech
    const data = await res.json();
    
    // On transforme l’API en format local
    products = data.products.map(p => ({
      name: p.title,
      price: p.price,
      category: p.category
    }));

    // On récupère les catégories uniques
    categories = [...new Set(products.map(p => p.category))];

    saveAll();
    renderProducts();
    renderCategories();
  } catch (err) {
    console.error("Erreur API :", err);
    alert("Impossible de charger les produits depuis l'API.");
  }
}

// ===============================
// Init
// ===============================
loadProductsFromAPI(); // Charge les produits réels
renderProducts();
renderCategories();
updateChart();
updateKPIs();
