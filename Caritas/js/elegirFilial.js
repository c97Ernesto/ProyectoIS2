
document.addEventListener("DOMContentLoaded", function() {
    cargarFiliales();
    
    const formulario = document.getElementById('elegirFilialForm');
    formulario.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const filialId = document.getElementById('filial').value;
        const horarioId = document.getElementById('fechaHora').value;

        try {
            const response = await fetch('http://localhost:3000/filial/elegirFilial', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filialId, horarioId })
            });

            if (response.ok) {
                alert('Filial elegida exitosamente');
                formulario.reset();
                cargarHorarios(); // Recargar horarios para actualizar disponibilidad
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            console.error('Error al elegir la filial:', error);
            alert('Error al elegir la filial');
        }
    });
});

async function cargarFiliales() {
    try {
        const response = await fetch('http://localhost:3000/filial');
        if (response.ok) {
            const filiales = await response.json();
            const selectFilial = document.getElementById('filial');

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

async function cargarHorarios() {
    const filialId = document.getElementById('filial').value;
    const selectHorario = document.getElementById('fechaHora');
    selectHorario.innerHTML = '<option value="">Seleccionar Fecha y Hora...</option>';

    try {
        const response = await fetch(`http://localhost:3000/filial/horarios/${filialId}`);
        if (response.ok) {
            const horarios = await response.json();
            horarios.forEach(horario => {
                if (horario.estado === 'disponible') {
                    const option = document.createElement('option');
                    option.value = horario.id;
                    option.textContent = new Date(horario.fechaHora).toLocaleString();
                    selectHorario.appendChild(option);
                }
            });
        } else {
            console.error('Error al cargar horarios');
        }
    } catch (error) {
        console.error('Error al cargar horarios:', error);
    }
}
