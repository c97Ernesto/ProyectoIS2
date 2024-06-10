document.addEventListener("DOMContentLoaded", function() {
    const elegir = document.getElementById('elegir');
    if(elegir){
        elegir.addEventListener('click',()=>{
            window.location.href='./elegirFilial.html';
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria');
    const token = localStorage.getItem('token');
    const idProductoObjetivo = localStorage.getItem('publicacionObjetivo');
    localStorage.setItem('productoId', idProductoObjetivo);

    if (categoria && token) {
        obtenerPublicacionesPorCategoria(categoria).then(publicaciones => {
            limpiarTarjetasPublicaciones(); // Limpia el contenedor antes de agregar nuevas tarjetas
            crearTarjetasPublicaciones(publicaciones);
  
        }).catch(error => {
            console.error("Error al obtener las publicaciones:", error);
        });
    } else {
        console.error("Categoría o token no disponible");
    }

    async function obtenerPublicacionesPorCategoria(categoria) {
        try {
            const response = await fetch(`http://localhost:3000/publicacion/buscarPorCategoriaPropio/${encodeURIComponent(categoria)}`, {
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
                <img src="${publicacion.imagenes}" alt="${publicacion.nombre}">
                <h3>${publicacion.nombre}</h3>
                <button data-id="${publicacion.id}" onclick="seleccionarProducto(${publicacion.id})">Seleccionar</button>
            `;
            nuevaPublicacion.querySelector('button').addEventListener('click', () => seleccionarProducto(publicacion.id));
            contenedorTarjetas.appendChild(nuevaPublicacion);
        });
    }

    async function seleccionarProducto(idProductoOfertante) {
        const filialId = localStorage.getItem('filialId');
        const horario = localStorage.getItem('horario');

        if (!filialId || !horario) {
            alert('Por favor, selecciona una filial y un horario antes de realizar la oferta.');
            return;
        }

        try {
            const response = await fetch('/ofertas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    idProductoObjetivo,
                    idProductoOfertante,
                    filialId,
                    horario
                })
            });

            if (!response.ok) {
                throw new Error(`Error al realizar la oferta: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            alert(result.message);
            localStorage.removeItem("filialId");
            localStorage.removeItem('horario');
            window.history.go(-2);
        } catch (error) {
            console.error("Error al realizar la oferta:", error);
            alert('Error al realizar la oferta.');
        }
    }
});