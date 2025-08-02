// scripts.js (o donde tengas tu JS)
let productos = [];
let currentCategory = 'todos';
let currentSort     = 'precio-asc';

async function cargarProductos() {
  try {
    const res = await fetch('productos.json');
    productos = await res.json();

    // setea selects al valor por defecto
    document.getElementById('filtro-categoria').value = currentCategory;
    document.getElementById('filtro-orden').value     = currentSort;

    applyFiltersAndSort();
  } catch (error) {
    document.getElementById('productos').innerHTML =
      '<p style="text-align:center; color:#666;">Error al cargar los productos.</p>';
  }
}

function applyFiltersAndSort() {
  // clonamos lista original
  let lista = productos.slice();

  // 1) filtro de categoría
  if (currentCategory !== 'todos') {
    lista = lista.filter(p => p.categoria === currentCategory);
  }

  // 2) orden seleccionado
  switch (currentSort) {
    case 'precio-asc':
      lista.sort((a, b) => a.precio - b.precio);
      break;
    case 'precio-desc':
      lista.sort((a, b) => b.precio - a.precio);
      break;
    case 'stock':
      // primero los que están en stock
      lista.sort((a, b) => ((b.stock > 0) ? 0 : 1) - ((a.stock > 0) ? 0 : 1));
      break;
  }

  renderizarProductos(lista);
}

function renderizarProductos(lista) {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';

  lista.forEach(prod => {
    const div = document.createElement('div');
    div.className = `producto ${prod.categoria}`;

    let stockLabel = '';
    if (prod.stock > 0) {
      stockLabel = `<span class="etiqueta-stock disponible">En stock x${prod.stock}</span>`;
    } else if (prod.espera) {
      stockLabel = `<span class="etiqueta-stock espera">Sobre pedido: ${prod.espera} días</span>`;
    }

    let colorSelect = '';
    if (prod.colores && prod.colores.length) {
      const options = prod.colores
        .map(c => `<option value="${c}">${c}</option>`)
        .join('');
      const idColor = `color-${prod.nombre.replace(/\s+/g, '-')}`;
      colorSelect = `
        <label for="${idColor}">Color:</label>
        <select id="${idColor}">${options}</select>
      `;
    }

    const agregarFn = prod.colores
      ? `agregarAlCarritoConColor('${prod.nombre}', ${prod.precio}, 'color-${prod.nombre.replace(/\s+/g, '-')}' )`
      : `agregarAlCarrito('${prod.nombre}', ${prod.precio})`;

    div.innerHTML = `
      ${stockLabel}
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>$${prod.precio.toLocaleString('es-CO')}</p>
      ${colorSelect}
      <button onclick="${agregarFn}">Agregar</button>
    `;

    contenedor.appendChild(div);
  });
}

function filtrarCategoria(cat) {
  currentCategory = cat;
  applyFiltersAndSort();
}

function ordenarProductos(criterio) {
  currentSort = criterio;
  applyFiltersAndSort();
}

document.addEventListener('DOMContentLoaded', cargarProductos);
