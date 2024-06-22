// detallesUsuario.js

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const usuarioCorreo = urlParams.get('correo');
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token no encontrado. No se puede obtener detalles del usuario.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioCorreo}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener detalles del usuario: " + response.status + " " + response.statusText);
        }

        const usuario = await response.json();
        mostrarDetallesUsuario(usuario);

        document.getElementById('editar-usuario').addEventListener('click', () => {
            // Redirigir a la página de edición del usuario
            window.location.href = `editarUsuario.html?correo=${usuarioCorreo}`;
        });

        document.getElementById('eliminar-usuario').addEventListener('click', async () => {
            try {
                const deleteResponse = await fetch(`http://localhost:3000/usuarios/${usuarioCorreo}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                });

                if (!deleteResponse.ok) {
                    throw new Error("Error al eliminar el usuario: " + deleteResponse.status + " " + deleteResponse.statusText);
                }

                alert("Usuario eliminado exitosamente.");
                window.location.href = 'listarUsuarios.html';

            } catch (error) {
                console.error("Error al eliminar el usuario:", error);
                alert("Hubo un error al eliminar el usuario.");
            }
        });

    } catch (error) {
        console.error("Error al obtener los detalles del usuario:", error);
        alert("Hubo un error al obtener los detalles del usuario.");
    }
});

function mostrarDetallesUsuario(usuario) {
    const usuarioDetalles = document.getElementById('usuario-detalles');
    usuarioDetalles.innerHTML = `
        <p>Correo: ${usuario.Correo}</p>
        <p>Rol: ${usuario.rol}</p>
        <p>DNI: ${usuario.DNI}</p>
        <p>Usuario: ${usuario.Usuario}</p>
        <p>Nombre: ${usuario.Nombre}</p>
        <p>Apellido: ${usuario.apellido}</p>
        <p>Telefono: ${usuario.Telefono}</p>
    `;
}
