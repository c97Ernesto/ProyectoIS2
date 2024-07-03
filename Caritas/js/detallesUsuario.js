
async function eliminarUsuario(usuarioCorreo) {
    const token = localStorage.getItem("token");
    try {
        console.log(`Intentando eliminar usuario con correo: ${usuarioCorreo}`);
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
        window.location.href = 'visualizarUsuarios.html';
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        alert("Hubo un error al eliminar el usuario.");
    }
}

async function eliminarOfertasDeUsuario(dni_ofertante) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:3000/ofertas/ofertas-por-dni/${dni_ofertante}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });
        if (!response.ok) {
            throw new Error(`Error al eliminar las ofertas del usuario con dni: ${dni_ofertante}: ${response.status} ${response.statusText}`);
        }
        console.log("Ofertas eliminadas correctamente");
    } catch (error) {
        console.error("Error al eliminar las ofertas del usuario ", error);
        throw error;
    }
}

async function eliminarPublicacionesDeUsuario(correoUsuario) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:3000/publicacion/publicaciones-por-correo/${correoUsuario}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });
        if (!response.ok) {
            throw new Error(`Error al eliminar las publicaciones del usuario con correo: ${correoUsuario}: ${response.status} ${response.statusText}`);
        }
        console.log("Publicaciones eliminadas correctamente");
    } catch (error) {
        console.error("Error al eliminar las publicaciones del usuario ", error);
        throw error;
    }
}

async function obtenerDetallesUsuario(usuarioCorreo, token) {
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

        return await response.json();

    } catch (error) {
        console.error("Error al obtener los detalles del usuario:", error);
        throw error;
    }
}

async function obtenerOfertasUsuario(dni_ofertante) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:3000/ofertas/ofertas-por-dni/${dni_ofertante}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });
        if (!response.ok) {
            throw new Error(`Error al obtener las ofertas del usuario "${dni_ofertante}": ${response.status} ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error al obtener las ofertas:", error);
        throw error;
    }
}

async function obtenerPublicacionesUsuario(correoUsuario) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:3000/publicacion/publicaciones-por-correo/${correoUsuario}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });
        if (!response.ok) {
            throw new Error(`Error al obtener las publicaciones del usuario "${correoUsuario}": ${response.status} ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error al obtener las publicaciones:", error);
        throw error;
    }
}

// MOSTRAR DETALLES
function mostrarDetallesEnDOM(usuario) {
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

    document.getElementById('eliminar-usuario').setAttribute('data-dni_ofertante', usuario.DNI);
    document.getElementById('eliminar-usuario').setAttribute('data-correoUsuario', usuario.Correo);

    document.getElementById('nombreUsuario').textContent = usuario.Nombre;    
}

// Evento cuando se carga el DOM
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const usuarioCorreo = urlParams.get('correo');
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token no encontrado. No se puede obtener detalles del usuario.");
        return;
    }
    try {
        const usuario = await obtenerDetallesUsuario(usuarioCorreo, token);

        mostrarDetallesEnDOM(usuario);

        document.getElementById('editar-usuario').addEventListener('click', () => {
            // Redirigir a la página de edición del usuario
            window.location.href = `http://localhost:3000/cambiarRol.html`;
        });

        document.getElementById('eliminar-usuario').addEventListener('click', async (event) => {
            const dni_ofertante = event.target.getAttribute('data-dni_ofertante');
            const correoUsuario = event.target.getAttribute('data-correoUsuario');

            // Asignar el correo del usuario al botón de confirmación de eliminación.
            document.getElementById('confirmarEliminar').setAttribute('data-correoUsuario', correoUsuario);
            document.getElementById('confirmarEliminar').setAttribute('data-dni_ofertante', dni_ofertante);

            // Obtener las ofertas del usuario
            try {
                const data = await obtenerOfertasUsuario(dni_ofertante); 
                console.log('Ofertas obtenidas:', data);
                document.getElementById('cant-ofertas-usuario').textContent = data.length;    
            } catch (error) {
                console.error('Error al obtener las ofertas:', error);
            }

            // Obtener publicaciones del usuario
            try {
                const data = await obtenerPublicacionesUsuario(correoUsuario); 
                console.log('Publicaciones obtenidas:', data);
                document.getElementById('cant-publicaciones-usuario').textContent = data.length;    
            } catch (error) {
                console.error('Error al obtener las publicaciones:', error);
            }
        });

    } catch (error) {
        console.error(error);
        alert("Hubo un error al obtener los detalles del usuario.");
    }

    document.getElementById('confirmarEliminar').addEventListener('click', async (event) => {
        const correoUsuario = event.target.getAttribute('data-correoUsuario');
        const dni_ofertante = event.target.getAttribute('data-dni_ofertante');

        try {
            await eliminarPublicacionesDeUsuario(correoUsuario);
            await eliminarOfertasDeUsuario(dni_ofertante);
            await eliminarUsuario(correoUsuario);
        } catch (error) {
            console.error("Error en el proceso de eliminación:", error);
            alert("Hubo un error en el proceso de eliminación.");
        }
    });
});
