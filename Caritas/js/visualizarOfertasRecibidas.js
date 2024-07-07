async function fetchOffersRecibidas() {
    const url = 'http://localhost:3000/ofertas-recibidas';
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error('No hay sesión iniciada');
            return;
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({})
        });
        if (!response.ok) {
            throw new Error('Respuesta del servidor no funcionó');
        }
        const result = await response.json();
        if (!result.success) {
            alert(result.message);
            return;
        }
        const data = result.data;
        displayOffers(data);
    } catch (error) {
        console.error('Error al obtener ofertas:', error);
    }
}

async function obtenerPublicacion(idPublicacion){
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token no encontrado. No se puede obtener usuarios.");
        return null;
    }
    try {
        const response = await fetch(`http://localhost:3000/publicacion/detalles/${idPublicacion}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });
        if (!response.ok) {
            throw new Error(
                "Error al obtener todos los usuarios: " +
                response.status +
                " " +
                response.statusText
            );
        }

        return await response.json(); // Almacena los usuarios obtenidos

    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        throw error;
    }
}

function displayOffers(data) {
    const offersList = document.getElementById('offers-list');
    offersList.innerHTML = '';

    data.forEach(async offer => {
        const prodOfertante = await obtenerPublicacion(offer.id_producto_ofertante);
        const prodReceptor = await obtenerPublicacion(offer.id_producto_receptor);

        const offerItem = document.createElement('li');
        offerItem.classList.add('offer-item');
        offerItem.innerHTML = `
            <div class"">
                <div>
                    <h3>Oferta de: ${offer.nombre_ofertante} para ${offer.nombre_receptor}</h3>
                    <p>Producto ofrecido: ${prodOfertante[0].nombre}</p>
                    <p>Producto solicitado: ${prodReceptor[0].nombre}</p>
                    <p>Estado: ${offer.estado}</p>
                    <p>Fecha de intercambio: ${new Date(offer.fecha_intercambio).toLocaleString()}</p>
                </div>
                <div >
                    <a href="./visualizarOfertaRecibida.html?id=${offer.id}">Ver detalles de la oferta</a>
                </div>
            </div>
        `;
        offersList.appendChild(offerItem);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    fetchOffersRecibidas();
});
