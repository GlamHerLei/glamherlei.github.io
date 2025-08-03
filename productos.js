let productos = [];
let currentCategory = 'todos';
let currentSort = 'precio-asc';

async function cargarProductos() {
  try {
    const res = await fetch('productos.json');
    productos = await res.json();
    applyFiltersAndSort();
  } catch (error) {
    document.getElementById('productos').innerHTML =
      '<p style="text-align:center; color:#666;">Error al cargar los productos.</p>';
  }
}

function applyFiltersAndSort() {
  let lista = productos.slice();

  if (currentCategory !== 'todos') {
    lista = lista.filter(p => p.categoria === currentCategory);
  }

  switch (currentSort) {
    case 'precio-asc':
      lista.sort((a, b) => a.precio - b.precio);
      break;
    case 'precio-desc':
      lista.sort((a, b) => b.precio - a.precio);
      break;
    case 'stock':
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
    if (prod.variantes) {
      stockLabel = `<span id="stock-${prod.nombre}" class="etiqueta-stock disponible">En stock x${prod.variantes[0].stock}</span>`;
    } else {
      stockLabel = prod.stock > 0
        ? `<span class="etiqueta-stock disponible">En stock x${prod.stock}</span>`
        : `<span class="etiqueta-stock espera">Sobre pedido</span>`;
    }

    let colorSelect = '';
    if (prod.variantes && prod.variantes.length) {
      const options = prod.variantes.map(v => `<option value="${v.color}">${v.color}</option>`).join('');
      const idColor = `color-${prod.nombre}`;
      colorSelect = `
        <label>Color:</label>
        <select id="${idColor}" onchange="actualizarVista('${prod.nombre}', '${idColor}', 'img-${prod.nombre}', 'stock-${prod.nombre}')">
          ${options}
        </select>
      `;
    }

    const agregarFn = prod.variantes
      ? `agregarAlCarritoConColor('${prod.nombre}', 'color-${prod.nombre}')`
      : `agregarAlCarrito('${prod.nombre}', ${prod.precio})`;

    div.innerHTML = `
      ${stockLabel}
      <img id="img-${prod.nombre}" src="${prod.variantes ? prod.variantes[0].imagen : prod.imagen}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>$${prod.precio.toLocaleString('es-CO')}</p>
      ${colorSelect}
      <button onclick="${agregarFn}">Agregar</button>
    `;

    contenedor.appendChild(div);
  });
}

function actualizarVista(nombre, colorSelectId, imagenId, stockId) {
  const producto = productos.find(p => p.nombre === nombre);
  const color = document.getElementById(colorSelectId).value;
  const variante = producto.variantes.find(v => v.color === color);

  if (variante) {
    document.getElementById(imagenId).src = variante.imagen;
    document.getElementById(stockId).textContent = variante.stock > 0
      ? `En stock x${variante.stock}`
      : "Sobre pedido";
  }
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
