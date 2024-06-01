async function obtenerTodasLasPublicaciones() {
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

function crearTarjetaPublicacion(publicaciones) {

  contenedorTarjetas.innerHTML = "";

  publicaciones.forEach((publicacion) => {
    const nuevaPublicacion = document.createElement("div");
    nuevaPublicacion.classList = "col p-2 d-flex justify-content-center";
    nuevaPublicacion.innerHTML = `
              <div class="card" style="width: 18rem; ">
                  <img src="${publicacion.imagenes}" style="max-width: 100%; height: auto; aspect-ratio: 1.5;" alt="...">
                  <div class="card-body">
                    <h5 class="card-title">${publicacion.nombre}</h5>
                    <p class="card-text">${publicacion.descripcion}.</p>
                    <div class="text-center">
                      <button data-id="${publicacion.id}" class="btn btn-primary">Ver publicación</a>
                    </div>
                  </div>
              </div>
          `;

    async function verPublicacion(publicacionId) {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = `http://localhost:3000/publicacion/${publicacionId}`;
      } else {
        try {
          const response = await fetch(
            `http://localhost:3000/publicacion/buscarPublicacionesAutenticado/${encodeURIComponent(
              publicacionId
            )}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Error al obtener los detalles de la publicación");
          }
          const contenido = await response.text();
          localStorage.setItem("detallePublicacion", contenido);
          localStorage.setItem("publicacionId", publicacionId);
          window.location.href = `./verDetallePublicacion.html`;

        } catch (error) {
          console.error(
            "Error al obtener los detalles de la publicación:",
            error
          );
        }
      }
    }

    const boton = nuevaPublicacion.querySelector('button');
    boton.addEventListener('click', () => {
      const publicacionId = boton.getAttribute('data-id');
      verPublicacion(publicacionId); // Llama a la función para ver la publicación
    });
    contenedorTarjetas.appendChild(nuevaPublicacion);
  });
  
}





//FILTRAR PUBLICACIONES POR NOMBRE

function filtrarPublicacionesPorNombre(publicaciones, texto) {
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

  obtenerTodasLasPublicaciones().then((publicaciones) => {
    const publicacionesFiltradas = filtrarPublicacionesPorNombre(publicaciones, textoFiltro);
    console.log(publicacionesFiltradas)
    if (publicacionesFiltradas.length == 0){
      alert("No hay publicaciones que coincidan con el texto ingresado.")
      obtenerTodasLasPublicaciones();
    } else{
      crearTarjetaPublicacion(publicacionesFiltradas);
    }
    
  });
});

//FILTRAR PUBLICACIONES POR ESTADO
function filtrarPorEstado(publicaciones, estado) {
  return publicaciones.filter((publicacion) => publicacion.estado === estado);
}

document.getElementById("btn-filter-state").addEventListener("click", () => {
  const estadoFiltro = document.getElementById("select-filter-state").value;

  obtenerTodasLasPublicaciones().then((publicaciones) => {
    const publicacionesFiltradas = filtrarPorEstado(publicaciones, estadoFiltro);

    if (publicacionesFiltradas.length == 0){
      alert("No hay publicaciones que se encuentren en ese estado.")
      obtenerTodasLasPublicaciones();
    } else{
      crearTarjetaPublicacion(publicacionesFiltradas);
    }
    
  });
});

// SE CARGAN TODAS LAS PUBLICACIONES
obtenerTodasLasPublicaciones().then((publicaciones) => {
  crearTarjetaPublicacion(publicaciones);
});