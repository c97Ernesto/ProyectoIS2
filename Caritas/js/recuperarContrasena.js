async function recuperarContrasena() {
    const correo = document.getElementById('correo').value;
    
    // Verificar que el campo de email no esté vacío
    if (!correo) {
        alert('Se deben completar los campos');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/recuperarContrasena', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo })  // Corrigiendo el formato del cuerpo de la solicitud
        });
        const data = await response.json(); // Parsear la respuesta JSON

        if (!response.ok) {
            alert(data.message || 'El correo electrónico esta registrado en el sistema');
            return;
        }

        alert(data.message || 'Se ha enviado un correo electrónico de recuperación de contraseña al usuario.');
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al enviar el correo electrónico.');
    }
}