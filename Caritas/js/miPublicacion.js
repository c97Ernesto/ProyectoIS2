const containerCard = document.getElementById("publicacion-container");
function mostrarPublicacion(id) {
  containerCard.innerHTML = "";

  const cardPublicacion = document.createElement("div");

  fetch(`http://localhost:3000/publicacion/${id}`)
    .then((response) => response.json())
    .then((publicacion) => {
      // Renderiza la página HTML con los datos de la publicación
      cardPublicacion.classList = "card-publicacion";

      cardPublicacion.innerHTML = `
      <div class="card mb-3">
      <div class="row g-0">
        <div class="col-md-5">
          <img src=${publicacion.imagenes} class="img-fluid rounded-start"  alt="...">
        </div>
        <div class="col-md-7">
          <div class="card-body text-center">
            <h5 class="card-title">${publicacion.nombre}</h5>
            <p class="card-text">${publicacion.descripcion}</p>
            <p class="card-text ">${publicacion.estado}</p>
            <p class="card-text ">${publicacion.categoria}</p>
            <div class="">
              <button type="button" class="btn btn-outline-primary">Editar publicación</button>
              <button type="button" class="btn btn-outline-danger">Eliminar publicación</button>
          </div>
          </div>
        </div>
      </div>
      `;
      containerCard.appendChild(cardPublicacion);
    })
    .catch((error) =>
      console.error("Error al obtener los detalles de la publicación:", error)
    );
}
