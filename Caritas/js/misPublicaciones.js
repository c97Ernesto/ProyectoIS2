document.addEventListener("DOMContentLoaded", function() {
  const nuevoPost = document.getElementById('agregarPublicacion');
      if(nuevoPost){
          nuevoPost.addEventListener('click',()=>{
          window.location.href='./nuevaPublicacion.html';
      });
      };
  });
      
  
  async function obtenerMisPublicaciones() {
    const token = localStorage.getItem('token');
  
    try {
        const response = await fetch('http://localhost:3000/publicacion/misPublicaciones', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
  
        if (!response.ok) {
            throw new Error('Error al obtener las publicaciones: ' + response.status + ' ' + response.statusText);
        }
  
        return await response.json();
    } catch (error) {
        console.error("Error al obtener las publicaciones:", error);
        throw error;
    }
  }
  
  const contenedorTarjetas = document.getElementById("productos-container");
  
  function crearTarjetasPublicaciones(publicaciones) {
    publicaciones.forEach(publicacion => {
        const nuevaPublicacion = document.createElement("div");
        nuevaPublicacion.classList = "tarjeta-publicacion";
        nuevaPublicacion.innerHTML = `
        <img src="${publicacion.imagenes}">
        <h3>${publicacion.nombre}</h3>
        <p>${publicacion.descripcion}</p>
        <button data-id="${publicacion.id}">Ver Publicación</button>

      `;
        contenedorTarjetas.appendChild(nuevaPublicacion);
    });
    
        // Agregar event listeners a los botones "Ver Publicación"
        const botonesVerPublicacion = document.querySelectorAll('.tarjeta-publicacion button');
        botonesVerPublicacion.forEach(boton => {
            boton.addEventListener('click', (event) => {
                const publicacionId = event.target.getAttribute('data-id');
                window.location.href = `http://localhost:3000/publicacion/${publicacionId}`;
            });
        });
    }

  
  
  obtenerMisPublicaciones().then(publicaciones => {
    crearTarjetasPublicaciones(publicaciones);
  });