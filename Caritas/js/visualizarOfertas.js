async function fetchOffers(type) {
    let url = '';
    if (type === 'enviadas') {
        url = 'http://localhost:3000/ofertas-enviadas';
    } else if (type === 'recibidas') {
        url = 'http://localhost:3000/ofertas-recibidas';
    }
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error('No hay sesión iniciada');
            return;
        }
        const response = await fetch(url, {
            method: 'POST', // Cambiado a POST
            headers: {
                'Content-Type': 'application/json', // Añadido el tipo de contenido
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({}) // Cuerpo vacío para solicitudes POST
        });
        if (!response.ok) {
            throw new Error('Respuesta del servidor no funciono');
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

function displayOffers(data) {
    const offersList = document.getElementById('offers-list');
    offersList.innerHTML = '';

    data.forEach(offer => {
        const listItem = document.createElement('li');
        listItem.textContent = `Oferta ID: ${offer.id} - Detalles: ${offer.detalles}`;
        offersList.appendChild(listItem);
    });
}


function displayOffers(offers) {
    const offersList = document.getElementById('offers-list');
    offersList.innerHTML = '';

    if (offers.length > 0) {
        offers.forEach(offer => {
            const offerItem = document.createElement('li');
            offerItem.classList.add('offer-item');
            offerItem.innerHTML = `
                <h3>Oferta de: ${offer.nombre_ofertante} para ${offer.nombre_receptor}</h3>
                <p>Producto ofrecido: ${offer.id_producto_ofertante}</p>
                <p>Producto solicitado: ${offer.id_producto_receptor}</p>
                <p>Estado: ${offer.estado}</p>
                <p>Fecha de intercambio: ${offer.fecha_intercambio}</p>
                <a href="http://localhost:3000/ofertas/misOfertas/${offer.id}">Ver detalles de la oferta</a>
            `;
            offersList.appendChild(offerItem);
        });
    } else {
        const noResultsItem = document.createElement('li');
        noResultsItem.classList.add('offer-item');
        noResultsItem.innerHTML = `<p>No se encontraron ofertas.</p>`;
        offersList.appendChild(noResultsItem);
    }
}
