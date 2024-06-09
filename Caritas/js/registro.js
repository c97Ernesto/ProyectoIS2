document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registroForm');

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que se envíe el formulario

        const formData = new FormData(registrationForm);
        const userData = {
            correo: formData.get('email'),
            password: formData.get('password'),
            usuario: formData.get('username'),
            nombre: formData.get('firstname'),
            apellido: formData.get('lastname'),
            nacimiento: new Date(formData.get("birthdate")),
            dni: parseInt(formData.get('dni'), 10),
            tlf: parseInt(formData.get('phone'), 10),
            rol: "comun"
        };

        const today = new Date();
        let age = today.getFullYear() - userData.nacimiento.getFullYear();
        if (today.getMonth() < userData.nacimiento.getMonth() ||
            (today.getMonth() === userData.nacimiento.getMonth() && today.getDate() < userData.nacimiento.getDate())) {
            age--;
        }

        if (age >= 18 && userData.password.length >= 3) {
            userData.nacimiento = userData.nacimiento.toISOString().slice(0, 19).replace('T', ' ');

            try {
                const response = await fetch('http://localhost:3000/registrar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                if (!response.ok) {
                    const respuestaError = await response.json();
                    alert(respuestaError.message);
                    throw new Error(respuestaError.message);
                }

                const responseData = await response.json();
                alert(responseData.message);
                window.location.href = './login.html';
            } catch (error) {
                console.error('Error en la solicitud:', error);
                alert('Error en la solicitud. Por favor, intente de nuevo.');
            }
        } else {
            if (age < 18) {
                alert('No se permite a los menores de edad registrarse.');
            } else {
                alert('La contraseña debe ser al menos 3 caracteres de largo.');
            }
        }
    });
});
