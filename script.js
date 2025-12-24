// SPA Navigation
const sections = document.querySelectorAll('.section');
const sidebarItems = document.querySelectorAll('.sidebar li');
const sectionTitle = document.getElementById('section-title');

sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        sections.forEach(sec => sec.classList.remove('active'));
        document.getElementById(item.dataset.section).classList.add('active');
        sectionTitle.textContent = item.textContent;
    });
});

// ===== Module 1  =====
let products = JSON.parse(localStorage.getItem("smart_dashboard_products")) || [];
const productForm = document.getElementById('product-form');
const productTableBody = document.querySelector('#product-table tbody');
const searchInput = document.getElementById('search-product');

function renderProducts(list = products) {
    productTableBody.innerHTML = '';
    list.forEach((p, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>${p.category}</td>
            <td>
                <button onclick="editProduct(${index})">Modifier</button>
                <button onclick="deleteProduct(${index})">Supprimer</button>
            </td>
        `;
        productTableBody.appendChild(tr);
    });
}

productForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('product-name').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value.trim();
    products.push({name, price, category});
    localStorage.setItem("smart_dashboard_products", JSON.stringify(products));
    renderProducts();
    productForm.reset();
});

window.deleteProduct = index => {
    if(confirm('Supprimer ce produit ?')) {
        products.splice(index,1);
        localStorage.setItem("smart_dashboard_products", JSON.stringify(products));
        renderProducts();
    }
};

window.editProduct = index => {
    const p = products[index];
    const newName = prompt('Nom', p.name);
    const newPrice = prompt('Prix', p.price);
    const newCategory = prompt('Catégorie', p.category);
    if(newName && newPrice && newCategory){
        products[index] = {name: newName, price: parseFloat(newPrice), category: newCategory};
        localStorage.setItem("smart_dashboard_products", JSON.stringify(products));
        renderProducts();
    }
};

searchInput.addEventListener('keyup', () => {
    const term = searchInput.value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(term)));
});

// ===== Module 2  =====
let categories = JSON.parse(localStorage.getItem("smart_dashboard_categories")) || [];
const categoryForm = document.getElementById('category-form');
const categoryList = document.getElementById('category-list');

function renderCategories() {
    categoryList.innerHTML = '';
    categories.forEach((c, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${c} <button onclick="deleteCategory(${index})">Supprimer</button>`;
        categoryList.appendChild(li);
    });
}

categoryForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('category-name').value.trim();
    if(name){
        categories.push(name);
        localStorage.setItem("smart_dashboard_categories", JSON.stringify(categories));
        renderCategories();
        categoryForm.reset();
    }
});

window.deleteCategory = index => {
    if(confirm('Supprimer cette catégorie ?')){
        categories.splice(index,1);
        localStorage.setItem("smart_dashboard_categories", JSON.stringify(categories));
        renderCategories();
    }
};

renderProducts();
renderCategories();
