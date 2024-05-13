document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const formData = new FormData(loginForm);
        const loginData = {
            correo: formData.get('email'),
            password: formData.get('password')
        };
    
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });
    
            if (!response.ok) {
                alert('Correo electrónico o contraseña incorrectos');
                return;
            }
    
            const data = await response.json();
            const { token, rol } = data;
    
            if (token) {
                localStorage.setItem('token', token);
                // Redirigir al usuario a la página adecuada según el rol
                if (rol === 'comun') {
                    alert("soy un usario comun")
                    window.location.href = './inicio';
                } else if (rol === 'voluntario') {
                    window.location.href = './voluntario.html';
                } else if (rol === 'administrador') {
                    window.location.href = './admin.html';
                }
            } else {
                alert('Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Error en la solicitud: ' + error.message);
        }
});
});