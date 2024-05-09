


function obtenerPublicacion(id){

  // Obtener el ID de la publicación de la URL
  // const urlParams = new URLSearchParams(window.location.search);
  // const publicacionId = urlParams.get('id');

  mostrarPublicacion(id);
}

function mostrarPublicacion(id) {
  
  const containerCard = document.getElementById("publicacion-container");
  containerCard.innerHTML = '';
  
  const cardPublicacion = document.createElement("div");

  // Llamar a getPublicacionById y manejar el resultado cuando se resuelva la promesa
  obtenerPublicacionPorId(id)
    .then((publicacion) => {
      console.log(publicacion);

      cardPublicacion.classList = "card-publicacion";

      cardPublicacion.innerHTML = `
      <div class="card mb-3">
      <div class="row g-0">
        <div class="col-md-5">
          <img src=${publicacion.imagenes} class="img-fluid rounded-start"  alt="...">
        </div>
        <div class="col-md-7">
          <div class="card-body">
            <h5 class="card-title">${publicacion.nombre}</h5>
            <p class="card-text">${publicacion.descripcion}</p>
            <p class="card-text ">${publicacion.estado}</p>
            <p class="card-text ">${publicacion.categoria}</p>
          </div>
        </div>
      </div>
      `;

      containerCard.appendChild(cardPublicacion);

    })
    .catch((error) => {
      // Manejar cualquier error que pueda ocurrir durante la obtención de la publicación
      console.error("Error al obtener la publicación:", error);
    });
}

obtenerPublicacion(id);
