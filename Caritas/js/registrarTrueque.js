document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('registrarTruequeForm');
    const urlParams = new URLSearchParams(window.location.search);
    const ofertaId = localStorage.getItem('ofertaId');

    if (!ofertaId) {
        alert('ID de oferta no proporcionado');
        return;
    }

    document.getElementById('ofertaId').value = ofertaId;

    form.addEventListener('submit', (event) => handleSubmit(event, form));
});

async function obtenerOferta(idOferta) {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token no encontrado en localStorage");
        return;
    }

    try {
        const ofertaResponse = await fetch(`http://localhost:3000/ofertas/detalles/${idOferta}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!ofertaResponse.ok) {
            throw new Error(`Error al obtener la publicación: ${ofertaResponse.status} ${ofertaResponse.statusText}`);
        }

        return await ofertaResponse.json();
    } catch (error) {
        console.error(`Error al obtener la oferta con id ${idOferta}: ${error}`);
    }
}

async function obtenerPublicacion(idPublicacion) {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token no encontrado en localStorage");
        return;
    }

    try {
        const publicacionResponse = await fetch(`http://localhost:3000/publicacion/detalles/${idPublicacion}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!publicacionResponse.ok) {
            throw new Error(`Error al obtener la publicación: ${publicacionResponse.status} ${publicacionResponse.statusText}`);
        }

        return await publicacionResponse.json();
    } catch (error) {
        console.error(`Error al obtener la publicación con id ${idPublicacion}: ${error}`);
    }
}

async function eliminarPublicacion(publicacionId) {
    const token = localStorage.getItem("token");
  
    try {
        const response = await fetch(`http://localhost:3000/publicacion/ofertas-por-filial/${publicacionId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });
        if (!response.ok) {
            throw new Error(`Error al eliminar la publicacion ${publicacionId} de la oferta aceptada: ${response.status} ${response.statusText}`);
        }
        await obtenerDetallesFiliales();
    } catch (error) {
        console.error(`Error al eliminar la publicacion ${publicacionId}. Error:  ${error}`);
    }
}

async function handleSubmit(event, form) {
    event.preventDefault();

    const descripcion = document.getElementById('descripcion').value;
    const estado = document.getElementById('estado').value;
    const donacion = document.getElementById('donacion').value;
    const token = localStorage.getItem('token');

    const ofertaId = localStorage.getItem('ofertaId');

    if (estado === "fallido") {
        if (ofertaId) {
            const oferta = await obtenerOferta(localStorage.getItem('ofertaId'));
            console.log(oferta);
            const publicacion1 = await obtenerPublicacion(oferta[0].id_producto_ofertante);
            console.log(publicacion1);
            // await eliminarPublicacion(publicacion1[0].id);
            const publicacion2 = await obtenerPublicacion(oferta[0].id_producto_receptor);
            console.log(publicacion2);
            // await eliminarPublicacion(publicacion2[0].id);
        }
    }

    try {
        const response = await fetch('http://localhost:3000/trueques/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ ofertaId, descripcion, estado, donacion })
        });

        if (response.ok) {
            handleSuccess(form);
        } else {
            handleError(await response.json());
        }
    } catch (error) {
        console.error('Error al registrar el estado del intercambio:', error);
        alert('Error al registrar el estado del intercambio');
    }
}

function handleSuccess(form) {
    alert('El intercambio ha sido registrado con éxito');
    form.reset();
    window.location.href = 'http://localhost:3000/visualizarTrueques.html';
}

function handleError(error) {
    alert('Error: ' + error.message);
}
