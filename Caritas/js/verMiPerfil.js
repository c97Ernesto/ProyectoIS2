async function obtenerMisDatos() {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:3000/usuarios/misDatos`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
        });
        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario');
        }

        const data = await response.json();
        mostrarMisDatos(data[0]);

    } catch (error) {
        console.error('Error:', error);
    }
}

function mostrarMisDatos(mi) {
    const fechaSinHora = obtenerFechaSinHora(mi.nacimiento);



    const misDatosDiv = document.getElementById('mis-datos');
    misDatosDiv.innerHTML = `
        <div class="row">
            <div class="col-md-8">
                <form id="formulario-datos">
                    <div class="mb-3 row">
                        <label for="staticEmail" class="col-sm-4 col-form-label">Email</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control" id="staticEmail" value="${mi.Correo}" readonly>
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="staticUsuario" class="col-sm-4 col-form-label">Usuario</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control" id="staticUsuario" value="${mi.Usuario}" readonly>
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="staticNombre" class="col-sm-4 col-form-label">Nombre</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control" id="staticNombre" value="${mi.Nombre}" readonly>
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="staticApellido" class="col-sm-4 col-form-label">Apellido</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control" id="staticApellido" value="${mi.apellido}" readonly>
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="staticNacimiento" class="col-sm-4 col-form-label">Nacimiento</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control" id="staticNacimiento" value="${fechaSinHora}" readonly>
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="staticDni" class="col-sm-4 col-form-label">DNI</label>
                        <div class="col-sm-8">
                            <input type="number" class="form-control" id="staticDni" value="${mi.DNI}" readonly>
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="staticTelefono" class="col-sm-4 col-form-label">Telefono</label>
                        <div class="col-sm-8">
                            <input type="number" class="form-control" id="staticTelefono" value="${mi.Telefono}" readonly>
                        </div>
                    </div>
                </form>
            </div>
            <div class="col-md-4 d-flex align-items-center">
                <button type="button" class="btn btn-outline-primary" id="editarBtn">Editar Datos</button>
            </div>
        </div>
    `;

    // Agregar evento al botón de editar
    const editarBtn = document.getElementById('editarBtn');
    editarBtn.addEventListener('click', () => {
        habilitarEdicion();
    });
}

function obtenerFechaSinHora(fechaISO) {
    const fechaSinHora = fechaISO.split('T')[0];
    return fechaSinHora;
}

function habilitarEdicion() {
    // Obtener todos los campos del formulario
    const form = document.getElementById('formulario-datos');
    const inputs = form.getElementsByTagName('input');

    console.log(inputs)

    // Habilitar la edición de los campos
    for (let i = 0; i < inputs.length; i++) {
        if (i == 0 || i == 4){
            inputs[i].readOnly = true;
        }
        else {
            inputs[i].readOnly = false;
        }
    }

    // Cambiar el texto y estilo del botón
    const editarBtn = document.getElementById('editarBtn');
    editarBtn.textContent = 'Guardar Cambios';
    editarBtn.classList.remove('btn-outline-primary');
    editarBtn.classList.add('btn-primary');

    // Cambiar el evento del botón para guardar los cambios
    editarBtn.removeEventListener('click', habilitarEdicion);
    editarBtn.addEventListener('click', guardarCambios);
}

async function guardarCambios() {
    // Obtener los valores de los campos editables
    const usuario = document.getElementById('staticUsuario').value;
    const nombre = document.getElementById('staticNombre').value;
    const apellido = document.getElementById('staticApellido').value;
    const dni = document.getElementById('staticDni').value;
    const telefono = document.getElementById('staticTelefono').value;

    if (!usuario || !nombre || !apellido || !dni || !telefono){
        alert("No pueden quedar campos vacíos!!")
        obtenerMisDatos()
        return
    }

    // Construir el objeto con los datos a enviar
    const datosActualizados = {
        usuario: usuario,
        nombre: nombre,
        apellido: apellido,
        dni: dni,
        telefono: telefono
    };

    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:3000/usuarios/misDatos`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(datosActualizados)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar los datos del usuario');
        }

        const data = await response.json();
        console.log('Datos actualizados:', data);

        // Volver a cargar los datos actualizados después de guardar
        obtenerMisDatos();

    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    obtenerMisDatos();
});