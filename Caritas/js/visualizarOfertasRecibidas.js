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
        return await response.json();
        
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
            throw new Error("Error al obtener la publicación: " +response.status +" " +response.statusText);
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

        if (prodOfertante.length != 0 && prodReceptor.length != 0){
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
        }
        else{
            if (prodOfertante.length === 0){
                console.log("No se pudo obtener el producto ofertante")
    
            }
            else {
                if (prodReceptor.length === 0){
                    console.log("No se pudo obtener el producto receptor")
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', async function () {
    const ofertas = await fetchOffersRecibidas();
    console.log(ofertas);
    if (ofertas.length === 0) {
        console.log("No hay ofertas recibidas");
        console.log(ofertas.data);
    }
    else{
        console.log("Hay ofertas recibidas");
        console.log(ofertas.data);
        displayOffers(ofertas.data)
    }
});
