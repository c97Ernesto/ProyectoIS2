
document.addEventListener("DOMContentLoaded", function() {
    const profileIcon = document.querySelector(".profile-icon");
    const dropdownContent = profileIcon.querySelector(".dropdown-content");

    // Función para mostrar u ocultar el menú desplegable al hacer clic en el perfil
    profileIcon.addEventListener("click", function() {
        dropdownContent.classList.toggle("hidden");
    });
});