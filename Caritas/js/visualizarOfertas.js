async function fetchOffers(type) {
    const email = localStorage.getItem('userEmail'); // Asumiendo que el correo está almacenado como 'userEmail'
    if (!email) {
        console.error('No user email found in localStorage');
        return;
    }

    let url = '';
    if (type === 'enviadas') {
        url = `http://localhost:3000/ofertas-enviadas?email=${encodeURIComponent(email)}`;
    } else if (type === 'recibidas') {
        url = `http://localhost:3000/ofertas-recibidas?email=${encodeURIComponent(email)}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayOffers(data);
    } catch (error) {
        console.error('Error fetching offers:', error);
    }
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
