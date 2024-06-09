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
    
            if (token) {//usuario registrado entra aqui
                localStorage.setItem('token', token);
                if (rol === 'comun') {
                    window.location.href = 'http://localhost:3000/inicio';
                } else if (rol === 'voluntario') {
                    window.location.href = './perfilVoluntario';
                } else if (rol === 'administrador') {
                    window.location.href = './PerfilAdm';
                }
            } else {
                alert('Error al iniciar sesión');
            }
        } catch (error) {//usuario no registrado entra aqui
            console.error('Error en la solicitud:', error);
            alert('Error en la solicitud: ' + error.message);
        }
});
});