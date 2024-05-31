async function obtenerPublicacionesFiltradas() {
  const token = localStorage.getItem("token");

  if (!token) {
    // si no hay token devuelvo todas las publicaciones
    try {
      const response = await fetch("http://localhost:3000/publicacion/");
      if (!response.ok) {
        throw new Error(
          "Error al obtener las publicaciones: " +
            response.status +
            " " +
            response.statusText
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener las publicaciones:", error);
      throw error;
    }
  } // si hay token no importa si expiró o no devuelvo todas las publicaciones que no son de
  try {
    const response = await fetch(
      "http://localhost:3000/publicacion/publicacionesAgenas",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Error al obtener las publicaciones: " +
          response.status +
          " " +
          response.statusText
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener las publicaciones:", error);
    throw error;
  }
}


const contenedorTarjetas = document.getElementById("publicacionesAgenas-container");

function crearTarjetaOferta(publicaciones) {

  contenedorTarjetas.innerHTML = "";

  publicaciones.forEach((publicacion) => {
    const nuevaPublicacion = document.createElement("div");
    nuevaPublicacion.classList = "tarjeta-publicacion col p-2";
    nuevaPublicacion.innerHTML = `
              <div class="card" style="width: 18rem; ">
                  <img src="${publicacion.imagenes}" class="m-3" alt="...">
                  <div class="card-body">
                  <h5 class="card-title">${publicacion.nombre}</h5>
                  <p class="card-text">${publicacion.descripcion}.</p>
                  <button data-id="${publicacion.id}" class="btn btn-primary">Ver publicación</a>
                  </div>
              </div>
          `;

             // Agregar evento click al botón
    const boton = nuevaPublicacion.querySelector('button');
    boton.addEventListener('click', () => {
      const publicacionId = boton.getAttribute('data-id');
      window.location.href = `http://localhost:3000/publicacion/${publicacionId}`;
    });
    contenedorTarjetas.appendChild(nuevaPublicacion);
  });
  
}





//FILTRAR PUBLICACIONES

function filtrarPublicaciones(publicaciones, texto) {
  const textoMinusculas = texto.toLowerCase();

  return publicaciones.filter((publicacion) => {
    const nombreMinusculas = publicacion.nombre.toLowerCase();
    const descripcionMinusculas = publicacion.descripcion.toLowerCase();
    return (
      nombreMinusculas.includes(textoMinusculas) ||
      descripcionMinusculas.includes(textoMinusculas)
    );
  });
}

document.getElementById("btn-filter-name").addEventListener("click", () => {
  const textoFiltro = document.getElementById("input-filter-name").value;

  obtenerPublicacionesFiltradas().then((publicaciones) => {
    const publicacionesFiltradas = filtrarPublicaciones(publicaciones, textoFiltro);
    crearTarjetaOferta(publicacionesFiltradas);
  });
});

// Inicialmente cargar todas las publicaciones
obtenerPublicacionesFiltradas().then((publicaciones) => {
  crearTarjetaOferta(publicaciones);
});