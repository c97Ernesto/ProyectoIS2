document.addEventListener("DOMContentLoaded", function() {
    cargarUsuarios();

    const formulario = document.getElementById('cambiarRolForm');
    const user = document.getElementById('user');
    const rol = document.getElementById('rol');
    const rolActual = document.getElementById('rolActual');

    // Cuando se selecciona un usuario, se muestra su rol actual
    user.addEventListener('change', async function() {
        const usuarioCorreo = user.value;
        if (usuarioCorreo) {
            try {
                const response = await fetch(`http://localhost:3000/usuarios/${usuarioCorreo}`);
                if (response.ok) {
                    const usuario = await response.json();
                    rolActual.value = usuario.rol;
                } else {
                    const error = await response.json();
                    console.error('Error al obtener el rol del usuario:', error);
                }
            } catch (error) {
                console.error('Error al obtener el rol del usuario:', error);
            }
        } else {
            rolActual.value = ''; // Limpiar el campo si no se selecciona ningún usuario
        }
    });

    formulario.addEventListener('submit', async function(event) {
        event.preventDefault();
        const usuarioCorreo = user.value;
        const nuevoRol = rol.value;

        try {
            const response = await fetch('http://localhost:3000/usuarios/cambiarRol', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuarioCorreo, nuevoRol})
            });

            if (response.ok) {
                alert('Se cambió el rol del usuario con éxito');
                formulario.reset();
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            console.error('Error al cambiar rol:', error);
            alert('Error al cambiar rol');
        }
    });
});

async function cargarUsuarios() {
    try {
        const response = await fetch(`http://localhost:3000/usuarios`, {
            headers: {}
        });

        if (response.ok) {
            const usuarios = await response.json();
            if(usuarios.length === 0){
                alert("No hay usuarios registrados en el sistema");
            }
            const select = document.getElementById('user');

            usuarios.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario.correo; 
                option.textContent = `${usuario.nombre} ${usuario.apellido}`;
                select.appendChild(option);
            });
        } else {
            const error = await response.json();
            console.error('Error al cargar usuarios:', error);
        }
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}