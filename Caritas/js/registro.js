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
            tlf: parseInt(formData.get('phone'), 10),
            rol:"comun"
        };
             // Calcular la edad en años
            const today = new Date();
            age = today.getFullYear() - userData.nacimiento.getFullYear();
            if (today.getMonth() < userData.nacimiento.getMonth() ||
                (today.getMonth() === userData.nacimiento.getMonth() && today.getDate() < userData.nacimiento.getDate())) {
                age--;
            }
            // Verificar si la edad es mayor o igual a 18 años
            if (age >= 18 && userData.password.length>=3) { //TAMBIEN PREGUNTA SI LA LONGITUD DE LA PASSW ES MAYOR A 3
                userData.nacimiento = userData.nacimiento.toISOString().slice(0, 19).replace('T', ' ');
                try {
                    const response = await fetch('http://localhost:3000/registrar', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    });
        
                    if (!response.ok) {//de 200 a 299 es una respuesta positiva, sino es error
                        const respuestaError = await response.json();
                        alert(await respuestaError.message)
                        throw new Error('Credenciales inválidas');
                    }
        
                    var responseData1 = await response.json();
                    var { mensaje } = responseData1;
                    if(mensaje=null){
                        alert("Error al registrar.")
                        return;
                    }
                    console.log('Respuesta del servidor:', responseData1);
                    alert("Usted fue registrado en el sistema")
                    window.location.href = './login.html';
                } catch (error) {
                    console.error('Error en la solicitud:', error);
                }
                
                //o indicar exito en la operacion
            } else {
                if (age<18) {
                    alert('no se permite a los menores de edad registrarse.');
                }else{
                    alert('la contraseña debe ser al menos 3 caracteres de largo.');
                }
            }       
    });
});