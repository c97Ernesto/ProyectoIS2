document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById('crearFilialForm');

    formulario.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;
        const horaInicio = document.getElementById('horaInicio').value;
        const horaFin = document.getElementById('horaFin').value;
        const intervalo = document.getElementById('intervalo').value;
        const diasTrabajo = Array.from(document.querySelectorAll('input[name="diasTrabajo"]:checked')).map(input => input.value);

        const hoy = new Date().toISOString().split('T')[0]; // Obtener la fecha de hoy en formato YYYY-MM-DD

        console.log('Fecha de hoy:', hoy);
        console.log('Fecha de inicio:', fechaInicio);
        console.log('Fecha de fin:', fechaFin);

        if (fechaInicio < hoy) {
            alert('La fecha de inicio no puede ser menor a la fecha de hoy.');
            return;
        }

        if (fechaInicio > fechaFin) {
            alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/filial', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, fechaInicio, fechaFin, horaInicio, horaFin, intervalo, diasTrabajo })
            });

            if (response.ok) {
                alert('Filial creada exitosamente');
                formulario.reset();
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            console.error('Error al crear la filial:', error);
            alert('Error al crear la filial');
        }
    });
});
