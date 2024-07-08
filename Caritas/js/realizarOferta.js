//realizarOferta.js

document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem('token');
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria');
    const idProductoObjetivo = localStorage.getItem('publicacionObjetivo');
    localStorage.setItem('productoId', idProductoObjetivo);

    if (categoria && token) {
        obtenerPublicacionesPorCategoria(categoria).then(publicaciones => {
            limpiarTarjetasPublicaciones(); 
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
    const filialSection = document.getElementById('filial-section');
    const filialSelect = document.getElementById('filial-select');
    const horarioSection = document.getElementById('horario-section');
    const horarioSelect = document.getElementById('horario-select');
    const confirmarOfertaButton = document.getElementById('confirmar-oferta');

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
        localStorage.setItem('idProductoOfertante', idProductoOfertante);
        await cargarFiliales();
        filialSection.style.display = 'block';
    }

    async function elegirFilial() {
        const filialId = document.getElementById('filial-select').value;
        const horarioId = document.getElementById('horario-select').value;

        try {
            const response = await fetch('http://localhost:3000/filial/elegirFilial', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filialId, horarioId })
            });

            if (response.ok) {
                localStorage.setItem('filialId', filialId);
                localStorage.setItem('horario', horarioId);
                formulario.reset();
                cargarHorarios(); // Recargar horarios para actualizar disponibilidad
                window.history.go(-1);
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            console.error('Error al elegir la filial:', error);
        }
    }

    async function cargarFiliales() {
        try {
            const response = await fetch('http://localhost:3000/filial');
            if (response.ok) {
                const filiales = await response.json();
                const selectFilial = document.getElementById('filial-select');

                if (filiales.length === 0) {
                    alert('No hay filiales disponibles para realizar el intercambio');
                    return;
                }

                filiales.forEach(filial => {
                    const option = document.createElement('option');
                    option.value = filial.id;
                    option.textContent = filial.nombre;
                    selectFilial.appendChild(option);
                });

                selectFilial.addEventListener('change', cargarHorarios);
            } else {
                console.error('Error al cargar filiales');
            }
        } catch (error) {
            console.error('Error al cargar filiales:', error);
        }
    }

    filialSelect.addEventListener('change', () => {
        localStorage.setItem('filialId', filialSelect.value);
        horarioSection.style.display = 'block';
    });

    horarioSelect.addEventListener('change', () => {
        localStorage.setItem('horario', horarioSelect.value);
        confirmarOfertaButton.style.display = 'block';
    });

    async function cargarHorarios() {
        const filialId = document.getElementById('filial-select').value;

        try {
            const response = await fetch(`http://localhost:3000/filial/horarios/${filialId}`);
            if (response.ok) {
                const horarios = await response.json();
                const selectHorario = document.getElementById('horario-select');
                selectHorario.innerHTML = ''; // Limpiar horarios previos

                let horariosDisponibles = false;
                horarios.forEach(horario => {
                    if (horario.estado === 'disponible') {
                        horariosDisponibles = true;
                        const option = document.createElement('option');
                        option.value = horario.id;
                        option.textContent = `Disponible: ${new Date(horario.fechaHora).toLocaleString()}`;
                        selectHorario.appendChild(option);
                    }
                });

                if (!horariosDisponibles) {
                    const option = document.createElement('option');
                    option.textContent = 'No hay horarios disponibles';
                    selectHorario.appendChild(option);
                }
            } else {
                console.error('Error al cargar horarios');
            }
        } catch (error) {
            console.error('Error al cargar horarios:', error);
        }
    }

    confirmarOfertaButton.addEventListener('click', async () => {
        const idProductoOfertante = localStorage.getItem('idProductoOfertante');
        const filialId = localStorage.getItem('filialId');
        const horario = localStorage.getItem('horario');
        elegirFilial();
        if (!idProductoOfertante || !filialId || !horario) {
            alert('Por favor, selecciona una publicación, filial y horario antes de realizar la oferta.');
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
            window.location.href = `http://localhost:3000/ofertas-enviadas`;
        } catch (error) {
            console.error("Error al realizar la oferta:", error);
            alert('Error al realizar la oferta.');
        }
    });
});
