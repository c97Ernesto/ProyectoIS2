
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

async function obtenerVoluntariosDeFilial(id_filial) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:3000/filialVoluntario/voluntarios-de-filial/${id_filial}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });
        if (!response.ok) {
            throw new Error(`Error al obtener los voluntarios de la Filial "${id_filial}": ${response.status} ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error al obtener los voluntarios:", error);
        throw error;
    }
}

async function obtenerFilialDelVoluntario(idUsuario) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:3000/filialVoluntario/filial-del-voluntario/${idUsuario}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });
        if (!response.ok) {
            throw new Error(`Error al obtener filial_voluntario del usuario con correo "${idUsuario}": ${response.status} ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error al obtener filial_voluntario:", error);
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

    document.getElementById('btn-eliminar').setAttribute('data-dni_ofertante', usuario.DNI);
    document.getElementById('btn-eliminar').setAttribute('data-correoUsuario', usuario.Correo);
    document.getElementById('btn-eliminar').setAttribute('data-rol', usuario.rol);

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

        localStorage= localStorage.setItem('correo', usuario.Correo);
        localStorage.setItem('rolActual', usuario.rol);
        mostrarDetallesEnDOM(usuario);

        document.getElementById('editar-usuario').addEventListener('click', () => {
            // Redirigir a la página de edición del usuario
            window.location.href = `http://localhost:3000/cambiarRol.html`;
        });

        document.getElementById('btn-eliminar').addEventListener('click', async (event) => {
            const dni_ofertante = event.target.getAttribute('data-dni_ofertante');
            const correoUsuario = event.target.getAttribute('data-correoUsuario');
            const rolUsuario = event.target.getAttribute('data-rol');

            // Asignar el correo del usuario al botón de confirmación de eliminación.
            document.getElementById('btn-confirmarEliminar').setAttribute('data-correoUsuario', correoUsuario);
            document.getElementById('btn-confirmarEliminar').setAttribute('data-dni_ofertante', dni_ofertante);
            document.getElementById('btn-confirmarEliminar').setAttribute('data-rol', rolUsuario);

            document.getElementById('modal-body').innerHTML = ''

            if (rolUsuario === 'comun') {

                // Obtener las ofertas del usuario
                try {
                    const ofertas = await obtenerOfertasUsuario(dni_ofertante);
                    const modalBody = document.getElementById('modal-body');
                    modalBody.innerHTML = `
                        <p class="text-center">Las publicaciones del usuario y las ofertas que estén relacionadas con él, serán eliminadas.</p>
                        <p>Ofertas establecidas: ${ofertas.length}</p>
                    `;
                } catch (error) {
                    console.error('Error al obtener las ofertas:', error);
                }

                // Obtener publicaciones del usuario
                try {
                    const publicaciones = await obtenerPublicacionesUsuario(correoUsuario);
                    const modalBody = document.getElementById('modal-body');
                    modalBody.innerHTML += `
                        <p>Cantidad de publicaciones realizadas: ${publicaciones.length}</p>
                    `;
                } catch (error) {
                    console.error('Error al obtener las publicaciones:', error);
                }

            }
            else if (rolUsuario === 'voluntario') {
                try {
                    // const filial_voluntario = await obtenerFilialDelVoluntario(correoUsuario);
                    // const idFilial = filial_voluntario[0].id_filial
                    // const voluntarios = await obtenerVoluntariosDeFilial(idFilial);
                    
                    //FALTA BUSCAR LAS FILIALES DONDE EL VOLUNTARIO A ELIMINAR SEA EL ÚNICO VOLUNTARIO EN LA FILIAL

                    if (cantVoluntariosFilial > 1) {
                        const modalBody = document.getElementById('modal-body');
                        modalBody.innerHTML = `
                            <p>La filial continuará en estado "activa" ya que se cuenta con más voluntarios disponibles.</p>
                        `;
                    }
                    else if (cantVoluntariosFilial == 1) {
                        const modalBody = document.getElementById('modal-body');
                        modalBody.innerHTML = `
                            <p>La filial no cuenta con más voluntarios disponibles, pasará a estado "inactiva"</p>
                        `;
                    }
                    
                } catch (error) {
                    console.error('Error al obtener los voluntarios:', error);
                }

                
            }


        });

    } catch (error) {
        console.error(error);
        alert("Hubo un error al obtener los detalles del usuario.");
    }

    document.getElementById('btn-confirmarEliminar').addEventListener('click', async (event) => {
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
