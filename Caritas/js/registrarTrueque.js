document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('registrarTruequeForm');
    const urlParams = new URLSearchParams(window.location.search);
    const ofertaId = localStorage.getItem('ofertaId');

    if (!ofertaId) {
        alert('ID de oferta no proporcionado');
        return;
    }
    document.getElementById('ofertaId').value = ofertaId;

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const descripcion = document.getElementById('descripcion').value;
        const estado = document.getElementById('estado').value;
        const donacion= document.getElementById('donacion').value;
        const token = localStorage.getItem('token');

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
                alert('El intercambio ha sido registrado con éxito');
                form.reset();
                window.location.href='http://localhost:3000/visualizarTrueques.html'

            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            console.error('Error al registrar el estado del intercambio:', error);
            alert('Error al registrar el estado del intercambio');
        }
    });
});