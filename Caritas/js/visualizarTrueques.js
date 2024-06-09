document.addEventListener('DOMContentLoaded', function() {
    const buscarTruequesForm = document.getElementById('buscarTruequesForm');
    const truequesPendientesDiv = document.getElementById('truequesPendientes');

    buscarTruequesForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const fecha = document.getElementById('fecha').value;
        await obtenerTruequesPendientes(fecha);
    });

    async function obtenerTruequesPendientes(fecha) {
        try {
            let url = 'http://localhost:3000/filial/truequesPendientes';
            if (fecha) {
                url += `?fecha=${fecha}`;
            }
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Agregar el token JWT a la solicitud
                }
            });
            const trueques = await response.json();

            truequesPendientesDiv.innerHTML = '';
            if (response.ok) {
                trueques.forEach(trueque => {
                    const truequeDiv = document.createElement('div');
                    truequeDiv.className = 'trueque';

                    truequeDiv.innerHTML = `
                        <p><strong>ID:</strong> ${trueque.id}</p>
                        <p><strong>Ofertante:</strong> ${trueque.nombre_ofertante} (DNI: ${trueque.dni_ofertante})</p>
                        <p><strong>Receptor:</strong> ${trueque.nombre_receptor} (DNI: ${trueque.dni_receptor})</p>
                        <p><strong>Producto Ofertante:</strong> ${trueque.nombre_producto_ofertante}</p>
                        <p><strong>Producto Receptor:</strong> ${trueque.nombre_producto_receptor}</p>
                        <p><strong>Fecha de Intercambio:</strong> ${trueque.fecha_intercambio}</p>
                    `;

                    truequesPendientesDiv.appendChild(truequeDiv);
                });
            } else {
                truequesPendientesDiv.innerHTML = `<p>${trueques.message}</p>`;
            }
        } catch (error) {
            console.error('Error al obtener trueques pendientes:', error);
            truequesPendientesDiv.innerHTML = `<p>Error al obtener trueques pendientes</p>`;
        }
    }

    // Obtener trueques pendientes al cargar la página
    obtenerTruequesPendientes();
});
