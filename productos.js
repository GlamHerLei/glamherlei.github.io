let productos = [];

async function cargarProductos() {
  try {
    const res = await fetch('productos.json');
    productos = await res.json();
    renderizarProductos(productos);
  } catch (error) {
    document.getElementById('productos').innerHTML = '<p style="text-align:center; color:#666;">Error al cargar los productos.</p>';
  }
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
      const options = prod.colores.map(c => `<option value="${c}">${c}</option>`).join('');
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
  if (cat === 'todos') {
    renderizarProductos(productos);
  } else {
    const filtrados = productos.filter(p => p.categoria === cat);
    renderizarProductos(filtrados);
  }
}

function ordenarProductos(criterio) {
  let ordenados = [...productos];
  switch (criterio) {
    case 'precio-asc':
      ordenados.sort((a, b) => a.precio - b.precio);
      break;
    case 'precio-desc':
      ordenados.sort((a, b) => b.precio - a.precio);
      break;
    case 'stock':
      ordenados.sort((a, b) => (b.stock > 0 ? 1 : -1) - (a.stock > 0 ? 1 : -1));
      break;
  }
  renderizarProductos(ordenados);
}

document.addEventListener('DOMContentLoaded', cargarProductos);
