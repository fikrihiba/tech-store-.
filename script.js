// ===== Données =====
let products = [];
let categories = [];

// ===== Navigation SPA =====
function showSection(id) {
  document.querySelectorAll(".section").forEach(section => section.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// ===== Module Produits =====
const form = document.getElementById("productForm");
const table = document.getElementById("productTable");
const categorySelect = document.getElementById("categorySelect");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const stock = parseInt(document.getElementById("stock").value);
  const category = categorySelect.value;
  const productId = form.dataset.editId;

  if (!name || price < 0 || stock < 0) {
    alert("Veuillez saisir des valeurs valides !");
    return;
  }

  if (productId) {
    const idx = products.findIndex(p => p.id === productId);
    if (idx !== -1) {
      products[idx] = { ...products[idx], name, price, stock, category };
    }
    delete form.dataset.editId;
  } else {
    const product = { id: Date.now().toString(), name, price, stock, category };
    products.push(product);
  }

  afficherProduits();
  form.reset();
});

// Affichage produits
function afficherProduits() {
  table.innerHTML = "";
  if (products.length === 0) {
    table.innerHTML = `<tr><td colspan="5" class="text-center">Aucun produit</td></tr>`;
    return;
  }

  products.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.name}</td>
      <td>${p.price} €</td>
      <td>${p.stock}</td>
      <td>${p.category || "-"}</td>
      <td>
        <button class="edit">Modifier</button>
        <button class="delete">Supprimer</button>
      </td>
    `;

    row.querySelector(".edit").addEventListener("click", () => {
      document.getElementById("name").value = p.name;
      document.getElementById("price").value = p.price;
      document.getElementById("stock").value = p.stock;
      categorySelect.value = p.category || "";
      form.dataset.editId = p.id;
      showSection("products");
    });

    row.querySelector(".delete").addEventListener("click", () => {
      if (confirm(`Supprimer le produit "${p.name}" ?`)) {
        products = products.filter(x => x.id !== p.id);
        afficherProduits();
      }
    });

    table.appendChild(row);
  });
}

// ===== Module Catégories =====
const categoryForm = document.getElementById("categoryForm");
const categoryList = document.getElementById("categoryList");

categoryForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("categoryName").value.trim();
  if (!name) return;

  if (!categories.includes(name)) {
    categories.push(name);
    afficherCategories();
    updateCategorySelect();
  } else {
    alert("Cette catégorie existe déjà !");
  }

  categoryForm.reset();
});

function afficherCategories() {
  categoryList.innerHTML = "";
  categories.forEach((cat, index) => {
    const li = document.createElement("li");
    li.textContent = cat + " ";
    const btn = document.createElement("button");
    btn.textContent = "Supprimer";
    btn.addEventListener("click", () => {
      if (products.some(p => p.category === cat)) {
        alert("Impossible de supprimer : des produits utilisent cette catégorie !");
        return;
      }
      categories.splice(index, 1);
      afficherCategories();
      updateCategorySelect();
    });
    li.appendChild(btn);
    categoryList.appendChild(li);
  });
}

// Met à jour la liste déroulante du formulaire produits
function updateCategorySelect() {
  categorySelect.innerHTML = '<option value="">-- Catégorie --</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}
