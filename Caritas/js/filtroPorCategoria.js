document.addEventListener('DOMContentLoaded', () => {
    const botonesCategorias = document.querySelectorAll('.categoria');

    botonesCategorias.forEach(boton => {
        boton.addEventListener('click', () => {
            const categoria = boton.id;
            window.location.href = `misPublicaciones.html?categoria=${categoria}`;
        });
    });
});





/*
document.addEventListener('DOMContentLoaded', () => {
    const botonesCategorias = document.querySelectorAll('.categoria');

    botonesCategorias.forEach(boton => {
        boton.addEventListener('click', () => {
            const categoria = boton.id;
            obtenerPublicacionesPorCategoria(categoria).then(publicaciones => {
                limpiarTarjetasPublicaciones();
                crearTarjetasPublicaciones(publicaciones);
            });
        });
    });

    async function obtenerPublicacionesPorCategoria(categoria) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:3000/publicaciones/${categoria}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
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

    const contenedorTarjetas = document.getElementById("productos-container");

    function limpiarTarjetasPublicaciones() {
        contenedorTarjetas.innerHTML = '';
    }

    function crearTarjetasPublicaciones(publicaciones) {
        publicaciones.forEach(publicacion => {
            const nuevaPublicacion = document.createElement("div");
            nuevaPublicacion.classList.add("tarjeta-publicacion");
            nuevaPublicacion.innerHTML = `
                <img src="${publicacion.imagenes}">
                <h3>${publicacion.nombre}</h3>
                <p>${publicacion.descripcion}</p>
                <button>Ver Publicación</button>
            `;
            contenedorTarjetas.appendChild(nuevaPublicacion);
        });
    }
});
*/