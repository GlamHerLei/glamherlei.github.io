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
  const mensaje = carrito.map(p => `• ${p.nombre} x${p.cantidad} - $${(p.precio * p.cantidad).toLocaleString()}`).join('%0A');
  const url = `https://wa.me/573186611074?text=Hola,+quiero+hacer+un+pedido:%0A${mensaje}`;
  window.open(url, '_blank');
}

function toggleCarrito() {
  const carritoDiv = document.getElementById('carrito');
  carritoDiv.style.display = carritoDiv.style.display === 'none' ? 'block' : 'none';
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

  if (!lista || !totalDiv || !contador) return; // evita errores si el HTML no lo tiene

  lista.innerHTML = '';
  let total = 0;
  let totalCantidad = 0;

  carrito.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}
      <button class="btn-cantidad" onclick="agregarAlCarrito('${item.nombre}', ${item.precio})">+</button>
      <button class="btn-cantidad" onclick="quitarDelCarrito('${item.nombre}')">–</button>
    `;
    lista.appendChild(li);
    total += item.precio * item.cantidad;
    totalCantidad += item.cantidad;
  });

  totalDiv.textContent = `Total: $${total.toLocaleString()}`;
  contador.textContent = totalCantidad;
}

// Al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  actualizarCarrito();
});
