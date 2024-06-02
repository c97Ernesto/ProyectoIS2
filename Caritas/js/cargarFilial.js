document.addEventListener("DOMContentLoaded", function() {
    cargarUsuariosVoluntarios();

    const formulario = document.getElementById('cargarFilialForm');
    const agregarHorarioButton = document.getElementById('agregarHorario');
    const horariosDiv = document.getElementById('horarios');

    agregarHorarioButton.addEventListener('click', function() {
        const nuevoHorario = document.createElement('input');
        nuevoHorario.type = 'datetime-local';
        nuevoHorario.name = 'fechaHora';
        nuevoHorario.required = true;
        horariosDiv.appendChild(nuevoHorario);
    });

    formulario.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const horarios = Array.from(document.querySelectorAll('input[name="fechaHora"]')).map(input => input.value);
        const fk_idUsuarioVoluntario = document.getElementById('fk_idUsuarioVoluntario').value;

        try {
            const response = await fetch('http://localhost:3000/filial', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, horarios, fk_idUsuarioVoluntario })
            });

            if (response.ok) {
                alert('Filial cargada exitosamente');
                formulario.reset();
                horariosDiv.innerHTML = `<label for="fechaHora">Fecha y Hora:</label><input type="datetime-local" id="fechaHora" name="fechaHora" required>`;
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            console.error('Error al cargar la filial:', error);
            alert('Error al cargar la filial');
        }
    });
});

async function cargarUsuariosVoluntarios() {
    try {
        const response = await fetch('http://localhost:3000/usuarios/voluntarios', {
            headers: {}
        });

        if (response.ok) {
            const usuarios = await response.json();
            const select = document.getElementById('fk_idUsuarioVoluntario');

            usuarios.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario.correo; 
                option.textContent = `${usuario.nombre} ${usuario.apellido}`; 
                select.appendChild(option);
            });
        } else {
            const error = await response.json();
            console.error('Error al cargar usuarios voluntarios:', error);
        }
    } catch (error) {
        console.error('Error al cargar usuarios voluntarios:', error);
    }
}
