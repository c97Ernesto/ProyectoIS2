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
        console.log(url)
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
        const data = await response.json();
        displayOffers(data);
    } catch (error) {
        console.error('Error al obtener ofertas:', error);
    }
}
