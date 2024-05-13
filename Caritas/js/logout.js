// Función para cerrar sesión
function logout() {
    // Eliminar el token de autenticación
    localStorage.removeItem('token');
    // Redirigir al usuario a la página de inicio de sesión
    window.location.href = './inicio.html'; // Cambia 'login.html' por la ruta de tu página de inicio 
    console.log("cerrar sesion exitoso");
}

// Manejar el evento beforeunload para cerrar la sesión antes de cerrar la página
window.addEventListener('beforeunload', function(event) {
    // Ejecutar la función logout al cerrar la página
    logout();
});

// Evento de clic en el botón de cerrar sesión
document.getElementById('logoutButton').addEventListener('click', logout);
