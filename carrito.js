let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarrito();
}

function agregarAlCarrito(nombre, precio) {
  const existente = carrito.find(p => p.nombre === nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  guardarCarrito();
}

function quitarDelCarrito(nombre) {
  const producto = carrito.find(p => p.nombre === nombre);
  if (producto) {
    producto.cantidad--;
    if (producto.cantidad <= 0) {
      carrito = carrito.filter(p => p.nombre !== nombre);
    }
  }
  guardarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
}

function enviarPedido() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }
  const mensaje = carrito.map(p =>
    `• ${p.nombre} x${p.cantidad} - $${(p.precio * p.cantidad).toLocaleString()}`
  ).join('%0A');
  const url = `https://wa.me/573186611074?text=Hola,+quiero+hacer+un+pedido:%0A${mensaje}`;
  window.open(url, '_blank');
}

function agregarAlCarritoConColor(nombre, precio, colorSelectId) {
  const color = document.getElementById(colorSelectId)?.value || '';
  const nombreConColor = `${nombre} (${color})`;
  agregarAlCarrito(nombreConColor, precio);
}

function actualizarCarrito() {
  const lista = document.getElementById('lista-carrito');
  const totalDiv = document.getElementById('total');
  const contador = document.getElementById('contador-carrito');

  if (!lista || !totalDiv || !contador) return;

  lista.innerHTML = '';
  let total = 0;
  let totalCantidad = 0;

  carrito.forEach(item => {
    const li = document.createElement('li');

    const nombreDiv = document.createElement('div');
    nombreDiv.innerHTML = `<strong>${item.nombre}</strong>`;

    const botonesDiv = document.createElement('div');
    botonesDiv.style.marginBottom = '8px';
    botonesDiv.innerHTML = `x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()} `;

    const btnMenos = document.createElement('button');
    btnMenos.className = 'btn-cantidad';
    btnMenos.textContent = '–';
    btnMenos.addEventListener('click', (e) => {
      e.stopPropagation();
      quitarDelCarrito(item.nombre);
    });

    const btnMas = document.createElement('button');
    btnMas.className = 'btn-cantidad';
    btnMas.textContent = '+';
    btnMas.addEventListener('click', (e) => {
      e.stopPropagation();
      agregarAlCarrito(item.nombre, item.precio);
    });

    botonesDiv.appendChild(btnMenos);
    botonesDiv.appendChild(btnMas);

    li.appendChild(nombreDiv);
    li.appendChild(botonesDiv);
    lista.appendChild(li);

    total += item.precio * item.cantidad;
    totalCantidad += item.cantidad;
  });

  totalDiv.textContent = `Total: $${total.toLocaleString()}`;
  contador.textContent = totalCantidad;
}

function toggleCarrito() {
  const carrito = document.getElementById('carrito');
  if (!carrito) return;
  carrito.style.display = carrito.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  actualizarCarrito();
});

// Cierra el carrito solo si se hace clic FUERA de él y del botón
window.addEventListener('click', function (e) {
  const carritoEl = document.getElementById('carrito');
  const toggleBtn = document.getElementById('toggle-carrito');

  if (!carritoEl || !toggleBtn) return;

  if (toggleBtn.contains(e.target)) return;
  if (carritoEl.contains(e.target)) return;

  carritoEl.style.display = 'none';
});
