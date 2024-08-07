document.addEventListener('DOMContentLoaded', async () => {
    const usuarioCorreo = localStorage.getItem('correo');
    const rolActual = localStorage.getItem('rolActual');
    const  dni_ofertante = localStorage.getItem("dni_ofertante");
   
    if (!usuarioCorreo) {
        alert('No se encontró el correo del usuario en localStorage');
        return;
    }

    const token = localStorage.getItem('token');
    const rol = document.getElementById('rol');
    const filialSection = document.getElementById('filialSection');
    const filialSelect = document.getElementById('filial');
    const formulario = document.getElementById('cambiarRolForm');

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

        cargarRoles(rolActual);

    } catch (error) {
        console.error('Error al obtener el rol del usuario:', error);
    }

    rol.addEventListener('change', function() {
        if (rol.value === 'voluntario') {
            filialSection.style.display = 'block';
            cargarFiliales();
        } else {
            filialSection.style.display = 'none';
        }
    });

    formulario.addEventListener('submit', async function(event) {
        event.preventDefault();
        const nuevoRol = rol.value;
        const filialId = filialSelect.value;

        if (nuevoRol === 'voluntario' && !filialId) {
            alert('Debe seleccionar una filial para asignarle al nuevo voluntario.');
            return;
        }

        try {
            if (nuevoRol === 'voluntario' && filialId && rolActual === 'administrador') {
                await asignarVoluntarioFilial(filialId, usuarioCorreo);
                alert('Se cambió el rol del usuario a voluntario con éxito');

            }else if (rolActual === 'voluntario') {
                const filas = await obtenerFilasDeFilial(usuarioCorreo);   
                if (filas.length === 1) {
                    const confirmar = confirm("La filial de la cual el usuario es voluntario, no tiene otros voluntarios. Si cambia el rol del usuario, la filial quedará inhabilitada para realizar intercambios y los intercambios pendientes para la filial serán cancelados ¿Deseas continuar con el cambio de rol?");
                    if (!confirmar) {
                        return;
                    }
                    
                }
                await designarVoluntario(usuarioCorreo, nuevoRol);
                alert('Se cambió el rol del usuario con éxito');
            } else if(rolActual === 'comun'){
                     const publicaciones = await obtenerPublicacionesUsuario(usuarioCorreo);
                    if (publicaciones.length > 0) {   
                        const confirmar = confirm("Las publicaciones pertenecientes al usuario serán eliminadas junto con las ofertas involucradas ¿Deseas continuar con la operación?");
                        if (!confirmar) {
                            return;
                        }
                        try {
                            await eliminarOfertasDeUsuario(dni_ofertante);
                            await eliminarPublicacionesDeUsuario(usuarioCorreo);
                            
                        } catch (error) {
                            console.error("Error en el proceso de eliminación:", error);
                            alert("Hubo un error en el proceso de eliminación.");
                        }
                    }
                    if(nuevoRol === 'voluntario' && filialId ){
                        await asignarVoluntarioFilial(filialId, usuarioCorreo);
                        alert('Se cambió el rol del usuario a voluntario con éxito');
                    }else{
                        await cambiarRolUsuario(usuarioCorreo, nuevoRol);
                    }
            }else{
                //si el rol actual es administrador
                await cambiarRolUsuario(usuarioCorreo, nuevoRol);
            }
            formulario.reset();
            window.location.href = `detallesUsuario.html?correo=${usuarioCorreo}`;
        } catch (error) {
            console.error('Error al cambiar rol:', error);
            alert('Error al cambiar rol aquí');
        }
    });
});

async function cargarFiliales() {
    try {
        const response = await fetch('http://localhost:3000/filial/todasFiliales');
        if (response.ok) {
            const filiales = await response.json();
            const selectFilial = document.getElementById('filial');
            selectFilial.innerHTML = '<option value="">Seleccionar Filial...</option>';

            filiales.forEach(filial => {
                const option = document.createElement('option');
                option.value = filial.id;
                option.textContent = filial.nombre;
                selectFilial.appendChild(option);
            });
        } else {
            console.error('Error al cargar filiales');
        }
    } catch (error) {
        console.error('Error al cargar filiales:', error);
    }
}

async function asignarVoluntarioFilial(filialId, correoNuevo) {
    const response = await fetch('http://localhost:3000/filialVoluntario/asignarVoluntario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filialId, correoNuevo })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
}

async function designarVoluntario(correoUsuario, nuevoRol) {
    try {
        const response = await fetch('http://localhost:3000/filialVoluntario/designarVoluntario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correoUsuario, nuevoRol })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        return await response.json();
    } catch (error) {
        throw new Error('Error al designar voluntario: ' + error.message);
    }
}

function mostrarDetallesUsuario(usuario) {
    const usuarioDetalles = document.getElementById('usuario-detalles');
    usuarioDetalles.innerHTML = `  
        <p>Usuario: ${usuario.Nombre} ${usuario.apellido}</p>
    `;
}

function cargarRoles(rolActual) {
    const rolesDisponibles = ['administrador', 'comun', 'voluntario'];
    const selectRol = document.getElementById('rol');

    rolesDisponibles.forEach(rol => {
        if (rol !== rolActual) {
            const option = document.createElement('option');
            option.value = rol;
            option.textContent = rol.charAt(0).toUpperCase() + rol.slice(1);
            selectRol.appendChild(option);
        }
    });
}

async function obtenerFilasDeFilial(correoUsuario) {
    try {
        const response = await fetch(`http://localhost:3000/filialVoluntario/voluntarioFilial/${correoUsuario}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Error ${response.status}: ${error.message}`);
        }

        const filas = await response.json();
        console.log('Filas obtenidas:', filas);
        return filas;
    } catch (error) {
        console.error('Error al obtener las filas de la filial:', error);
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

async function cambiarRolUsuario(usuarioCorreo, nuevoRol) {
    try {
        const response = await fetch('http://localhost:3000/usuarios/cambiarRol', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuarioCorreo, nuevoRol })
        });

        if (response.ok) {
            alert('Se cambió el rol del usuario con éxito');
        } else {
            const error = await response.json();
            alert('Error: ' + error.message);
        }
    } catch (error) {
        console.error('Error al cambiar rol:', error);
        alert('Error al cambiar rol');
    }
}
