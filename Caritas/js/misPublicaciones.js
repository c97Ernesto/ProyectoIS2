document.addEventListener("DOMContentLoaded", function() {
    const nuevoPost = document.getElementById('agregarPublicacion');
    if(nuevoPost){
        nuevoPost.addEventListener('click',()=>{
            window.location.href='./nuevaPublicacion.html';
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria');

    if (categoria) {
        obtenerPublicacionesPorCategoria(categoria).then(publicaciones => {
            limpiarTarjetasPublicaciones(); // Limpia el contenedor antes de agregar nuevas tarjetas
            crearTarjetasPublicaciones(publicaciones);
        });
    } else {
        obtenerMisPublicaciones().then(publicaciones => {
            limpiarTarjetasPublicaciones(); // Limpia el contenedor antes de agregar nuevas tarjetas
            crearTarjetasPublicaciones(publicaciones);
        });
    }

    async function obtenerPublicacionesPorCategoria(categoria) {
     
        try {
            const response = await fetch(`http://localhost:3000/publicacion/misPublicaciones/categoria/${categoria}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                   
                }
            });

            if (!response.ok) {
                throw new Error(`Error al obtener las publicaciones: ${response.status} ${response.statusText}`);
            }

            const publicaciones = await response.json();
            return publicaciones;
        } catch (error) {
            console.error("Error al obtener las publicaciones:", error);
            throw error;
        }
    }

    async function obtenerMisPublicaciones() {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/publicacion/misPublicaciones', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener las publicaciones: ' + response.status + ' ' + response.statusText);
            }

            return await response.json();
        } catch (error) {
            console.error("Error al obtener las publicaciones:", error);
            throw error;
        }
    }

    const contenedorTarjetas = document.getElementById("productos-container");

    function limpiarTarjetasPublicaciones() {
        contenedorTarjetas.innerHTML = '';
    }

    function crearTarjetasPublicaciones(publicaciones) {
        if (publicaciones.length === 0) {
            contenedorTarjetas.innerHTML = '<p id="no_publicaciones" style="text-align: center;">No hay publicaciones disponibles.</p>';
            return;
        }



        publicaciones.forEach(publicacion => {
            const nuevaPublicacion = document.createElement("div");
            nuevaPublicacion.classList = "tarjeta-publicacion";
            nuevaPublicacion.innerHTML = `
                <img src="${publicacion.imagenes}">
                <h3>${publicacion.nombre}</h3>
                <p>${publicacion.descripcion}</p>
                <button data-id="${publicacion.id}">Ver Publicación</button>
            `;
            contenedorTarjetas.appendChild(nuevaPublicacion);
        });

async function verPublicacion(publicacionId) {
    const token = localStorage.getItem('token');
    if (!token){
        window.location.href = `http://localhost:3000/publicacion/${publicacionId}`;
    }else{
    try {
        const response = await fetch(`http://localhost:3000/publicacion/buscarPublicacionesAutenticado/${encodeURIComponent(publicacionId)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los detalles de la publicación');
        }
        const contenido= await response.text();
        localStorage.setItem('detallePublicacion', contenido);
        localStorage.setItem('publicacionId', publicacionId);
        window.location.href= `./verDetallePublicacion.html`;
        
    } catch (error) {
        console.error('Error al obtener los detalles de la publicación:', error);
    }}
}

// Agregar event listeners a los botones "Ver Publicación"
const botonesVerPublicacion = document.querySelectorAll('.tarjeta-publicacion button');
botonesVerPublicacion.forEach(boton => {
    boton.addEventListener('click', (event) => {
        const publicacionId = event.target.getAttribute('data-id');
        verPublicacion(publicacionId); // Llama a la función para ver la publicación
    });
});


}
});
