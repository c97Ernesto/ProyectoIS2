document.addEventListener("DOMContentLoaded", function() {
    const profileIcon = document.querySelector(".profile-icon");
    const dropdownContent = profileIcon.querySelector(".dropdown-content");

    
    const miPostsButton = document.getElementById('myPostsButton');
    if(miPostsButton){
        miPostsButton.addEventListener('click',()=>{
            window.location.href='http://localhost:3000/misPublicaciones';
        });
    }

    // Verificar la existencia del token al cargar la página
    const token = localStorage.getItem('token'); // Función para verificar si el token existe (debes implementarla)

    // Obtener el elemento del avatar
    const avatarElement = document.querySelector('.profile-icon');

    if (token) {
        console.log('El token existe');
        // Función para mostrar u ocultar el menú desplegable al hacer clic en el perfil
        profileIcon.addEventListener("click", function() {
           dropdownContent.classList.toggle("hidden");
       });
    } else {
        // El token no existe en localStorage
        // Obtener los elementos de los botones
        const ofertasButton = document.querySelector('.header-buttons');

        // Ocultar los botones si no hay token en el localStorage
        if (ofertasButton) {
            ofertasButton.style.display = 'none';
        }
        if (avatarElement) {
            avatarElement.style.display = 'none';
        } else {
            console.log('No se encontró el elemento con la clase "avatar" dentro de "profile-icon".');
        }
         
        console.log('El token no existe');
    }
    

});