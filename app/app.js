

// Carrito en almacenamiento local
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Cargamos los productos en un archivo JSON
async function cargarMenu(){
    try{
        const resp = await fetch(`productos.json`);
        const data = await resp.json()
        productos = data;
        recorrido(data)
    } catch (error){
        console.error(`Error al obtener los datos`, error)
    }
}

// Mostrar productos
    const contenedor = document.getElementById('id_contenedor');
    contenedor.innerHTML = ''; // Limpiar el contenedor antes de agregar los productos

    function recorrido (data){
        data.forEach(producto => {
            const productoEl = document.createElement('div');
            productoEl.classList.add('contenedor');
            productoEl.innerHTML = `
                <div class="animation">
                    <img src="${producto.imagen}" alt="${producto.nombre}" />
                    <div class="title-name">
                        <p>${producto.nombre}</p>
                        <p class="precio">€${producto.precio}<span></span></p>
                        <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
                    </div>
                </div>
            `;
            contenedor.appendChild(productoEl);
        });
    }

// Agregamos los producto al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!carrito.some(item => item.id === id)) { // Evitar duplicados
    if (  carrito.push(producto));
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
           // Notificación con Toastify, libreria
        Toastify({
            text: "Producto agregado al carrito",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
            stopOnFocus: true, // Prevents dismissing of toast on hover
        }).showToast();

    } else {
        console.log('El producto ya está en el carrito');
    }
}


// Actualizamos el carrito
function actualizarCarrito() {
    const carritoItems = document.getElementById('carrito-items');
    const totalPrecio = document.getElementById('total-precio');
    const cartCount = document.getElementById('cart-count');
    carritoItems.innerHTML = "";
    let total = 0;
    carrito.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.textContent = `${item.nombre} - €${item.precio}`;
        carritoItems.appendChild(itemEl);
        total += item.precio;
    });

    totalPrecio.textContent = total.toFixed(2);
    cartCount.textContent = carrito.length;


    
    // Habilitar o deshabilitar el botón de compra dependiendo el contenido del carrito
    if (carrito.length > 0) {
        comprar.disabled = false;
    } else {
        comprar.disabled = true;
    }
}


// Evento para vaciar el carrito
document.getElementById('vaciar-carrito').addEventListener('click', () => {
    Swal.fire({
        title: "Estas seguro?",
        icon: 'question',
        iconColor: "#800",
        confirmButtonText: "Aceptar",
        text: 'Se encontraron productos en tu carrito',
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
        Swal.fire("Carrito vacio", "", "info");
        } else if (result.isDenied) {
        Swal.fire("Compra rechazada", "", "info");
        }
    });

    carrito = [];
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
});

// Modal del carrito
document.getElementById('carrito-icon').addEventListener('click', () => {
    const cartModal = document.getElementById('cart-modal');
    cartModal.classList.toggle('active');
});

// Evento para la compra
document.getElementById(`comprar`).addEventListener(`click`,() => {
    Swal.fire({
        title: "Estas seguro?",
        icon: 'question',
        iconColor: "#590",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
        text: '¡Aceptar para avanzar tu compra!',
        denyButtonText: `Rechazar`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
        Swal.fire("Tu compra a sido realizada con exito", "", "success");
        } else if (result.isDenied) {
        Swal.fire("Compra rechazada", "", "info");
        }
    });

 // Limpiar el carrito después de la compra
    carrito = [];
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
})

// Inicializar la visualización del carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarMenu();
    actualizarCarrito();
});


// Juego para el adivinanza
const numeroInput = document.getElementById('numero');
const enviarBtn = document.getElementById('enviar');
const messageEl = document.getElementById('message');

// Variables del juego
let intentos = 0;
const maxIntentos = 3;
const numeroCorrecto = 8;  // Número a adivinar

// Función para mostrar un mensaje al usuario y en la consola
function mostrarMensaje(mensaje) {
    messageEl.textContent = mensaje;
    console.log(mensaje);
}


// Evento para el botón de enviar
enviarBtn.addEventListener('click', () => {
    const usuario = parseInt(numeroInput.value);
    
    if (isNaN(usuario) || usuario < 1 || usuario > 10) {
        mostrarMensaje("Por favor, ingrese un número válido del 1 al 10.");
        return;
    }
    
    intentos++;
    
    
    if (usuario === numeroCorrecto) {
        Swal.fire({
    title: '¡Felicidades!',
    text: '"Has adivinado correctamente. Tendras un 20% de descuento en nuestra tienda por una prenda de tu elección."',
    icon: 'success',
    confirmButtonText: 'Aceptar',
    iconColor: "#080"
})
        enviarBtn.disabled = true;  // Deshabilitar el botón después de ganar
    } else if (intentos < maxIntentos) {
        mostrarMensaje(`El número ingresado no es el correcto. Te quedan ${maxIntentos - intentos} intentos.`);
    } else {
        // mostrarMensaje("Lo siento, has agotado todos tus intentos. Mejor suerte la próxima vez.");
        Swal.fire({
            title: '¡Error!',
            text: '"Lo siento, has agotado todos tus intentos. Suerte la proxima vez."',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            iconColor: "#700"
        })
        enviarBtn.disabled = true;  // Deshabilitar el botón después de agotar intentos
    }
    
    // Guardar el estado del juego en el almacenamiento local
    localStorage.setItem('intentos', intentos);
});

// Mensaje de bienvenida inicial
mostrarMensaje("Ingrese un número del 1 al 10 para obtener tu descuento. ¡Tienes 3 intentos, suerte!");

// Recuperar el estado del juego desde el almacenamiento local al cargar la página
if (intentos >= maxIntentos) {
    enviarBtn.disabled = true;
}

