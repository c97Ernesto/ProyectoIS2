document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registroForm');

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();// Evita que se envíe el formulario

        const formData = new FormData(registrationForm);
        const userData = {
            correo: formData.get('email'),
            password: formData.get('password'),
            usuario: formData.get('username'),
            nombre: formData.get('firstname'),
            apellido: formData.get('lastname'),
            nacimiento: new Date(formData.get("birthdate")),
            dni: parseInt(formData.get('dni'), 10),
            tlf: parseInt(formData.get('phone'), 10)
        };
             // Calcular la edad en años
            const today = new Date();
            age = today.getFullYear() - userData.nacimiento.getFullYear();
            if (today.getMonth() < userData.nacimiento.getMonth() ||
                (today.getMonth() === userData.nacimiento.getMonth() && today.getDate() < userData.nacimiento.getDate())) {
                age--;
            }
            // Verificar si la edad es mayor o igual a 18 años
            if (age >= 18) {
                
                try {
                    const response = await fetch('http://localhost:3000/registrar', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    });
        
                    if (!response.ok) {
                        throw new Error('Credenciales inválidas');
                    }
        
                    const responseData1 = await response.json();
                    const { token } = responseData1;
                    if(token!=null){
                        alert("Correo ya registrado.")
                        return;
                    }
                    // Almacenar el token en localStorage para usarlo en solicitudes posteriores
                    localStorage.setItem('token', token);
        
                    // Redirigir al usuario a otra página después de iniciar sesión
                    window.location.href = 'inicio.html'; // Cambiar esto por la página deseada después del inicio de sesión
        
                    const responseData2 = await response.json();
                    console.log('Respuesta del servidor:', responseData2);
                } catch (error) {
                    console.error('Error en la solicitud:', error);
                }
                
                //o indicar exito en la operacion
            } else {
                alert('asegurate de completar todos los campos y ser mayor de 18 años.');
            }
        
            
    });
});
