document.addEventListener("DOMContentLoaded", function() {
    cargarUsuarios();

    const formulario = document.getElementById('cambiarRolForm');
    const user = document.getElementById('user');
    const rol = document.getElementById('rol');
    const rolActual = document.getElementById('rolActual');
    const filialSection = document.getElementById('filialSection');
    const filialSelect = document.getElementById('filial');
    const nuevoVoluntarioSection = document.getElementById('nuevoVoluntarioSection');
    const nuevoVoluntarioSelect = document.getElementById('nuevoVoluntario');

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
            rolActual.value = ''; 
        }
    });

    // Mostrar/ocultar la sección de selección de filial basado en el rol seleccionado
    rol.addEventListener('change', function() {
        if (rol.value === 'voluntario') {
            filialSection.style.display = 'block';
            cargarFiliales();
        } else {
            filialSection.style.display = 'none';
        }

        if (rol.value === 'comun' && rolActual.value === 'voluntario') {
            nuevoVoluntarioSection.style.display = 'block';
            cargarVoluntarios();
        } else {
            nuevoVoluntarioSection.style.display = 'none';
        }
    });

    formulario.addEventListener('submit', async function(event) {
        event.preventDefault();
        const usuarioCorreo = user.value;
        const nuevoRol = rol.value;
        const filialId = filialSelect.value;
        const nuevoVoluntarioCorreo = nuevoVoluntarioSelect.value;

        try {
            if (nuevoRol === 'voluntario' && filialId) {
                await asignarVoluntarioFilial(filialId, usuarioCorreo);
                alert('Se cambió el rol del usuario y se asignó la filial con éxito');
            } else if (nuevoRol === 'comun' && rolActual.value === 'voluntario' && nuevoVoluntarioCorreo) {
                await reasignarVoluntario(usuarioCorreo, nuevoVoluntarioCorreo);
                alert('Se cambió el rol del usuario y se reasignó el voluntario con éxito');
            } else {
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
            }
            formulario.reset();
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
            if (usuarios.length === 0) {
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

async function cargarFiliales() {
    try {
        const response = await fetch('http://localhost:3000/filial');
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

async function cargarVoluntarios() {
    try {
        const response = await fetch('http://localhost:3000/usuarios/comunes');
        if (response.ok) {
            const voluntarios = await response.json();
            const selectVoluntario = document.getElementById('nuevoVoluntario');
            selectVoluntario.innerHTML = '<option value="">Seleccionar Nuevo Voluntario para la filial...</option>';

            voluntarios.forEach(voluntario => {
                const option = document.createElement('option');
                option.value = voluntario.correo;
                option.textContent = `${voluntario.nombre} ${voluntario.apellido}`;
                selectVoluntario.appendChild(option);
            });
        } else {
            console.error('Error al cargar voluntarios');
        }
    } catch (error) {
        console.error('Error al cargar voluntarios:', error);
    }
}

async function asignarVoluntarioFilial(filialId, correoNuevo) {
    const response = await fetch('http://localhost:3000/filial/asignarVoluntario', {
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

async function reasignarVoluntario(correoAntiguo, correoNuevo) {
    const response = await fetch('http://localhost:3000/filial/reasignarVoluntario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correoAntiguo, correoNuevo })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
}