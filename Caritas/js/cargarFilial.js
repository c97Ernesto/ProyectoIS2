document.addEventListener("DOMContentLoaded", function() {
    // Cargar usuarios voluntarios al cargar la página
    cargarUsuariosVoluntarios();

    // Manejar el envío del formulario
    const formulario = document.getElementById('cargarFilialForm');
    formulario.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const fechaHora = document.getElementById('fechaHora').value;
        const fk_idUsuarioVoluntario = document.getElementById('fk_idUsuarioVoluntario').value;

        try {
            const response = await fetch('http://localhost:3000/filial', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                   // 'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({ nombre, fechaHora, fk_idUsuarioVoluntario })
            });

            if (response.ok) {
                alert('Filial cargada exitosamente');
                formulario.reset();
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
            headers: {
                //'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        if (response.ok) {
            const usuarios = await response.json();
            const select = document.getElementById('fk_idUsuarioVoluntario');

            usuarios.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario.correo; 
                option.textContent = usuario.nombre;  
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
