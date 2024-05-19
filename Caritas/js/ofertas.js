async function obtenerOfertas() {
  const token = localStorage.getItem("token");

  if (token === null || token === undefined) {
    try {
      const response = await fetch("http://localhost:3000/publicacion/");
      if (!response.ok) {
        throw new Error(
          "Error al obtener las ofertas: " +
            response.status +
            " " +
            response.statusText
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener las ofertas:", error);
      throw error;
    }
  }
  try {
    const response = await fetch("http://localhost:3000/publicacion/ofertas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      throw new Error(
        "Error al obtener las ofertas: " +
          response.status +
          " " +
          response.statusText
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener las ofertas:", error);
    throw error;
  }
}

const contenedorTarjetas = document.getElementById("ofertas-container");

function crearTarjetaOferta(publicaciones) {
  publicaciones.forEach((publicacion) => {
    const nuevaPublicacion = document.createElement("div");
    nuevaPublicacion.classList = "tarjeta-publicacion";
    nuevaPublicacion.innerHTML = `
        <div class="col">
            <div class="card h-100">
                <img src="${publicacion.imagenes}" class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title">${publicacion.nombre}</h5>
                <p class="card-text">${publicacion.descripcion}.</p>
                <button data-id="${publicacion.id}" class="btn btn-primary">Ver publicación</a>
                </div>
            </div>
        </div>
        `;
    contenedorTarjetas.appendChild(nuevaPublicacion);
  });

  // Agregar event listeners a los botones "Ver Publicación"
  const botonesVerPublicacion = document.querySelectorAll(
    ".tarjeta-publicacion button"
  );
//   botonesVerPublicacion.forEach((boton) => {
//     boton.addEventListener("click", (event) => {
//       const publicacionId = event.target.getAttribute("data-id");
//       window.location.href = `http://localhost:3000/publicacion/${publicacionId}`;
//     });
//   });
}

function filtrarPublicaciones(publicaciones, texto) {
    // Convertir el texto a minúsculas para una comparación sin distinción entre mayúsculas y minúsculas
    const textoMinusculas = texto.toLowerCase();
  
    // Filtrar las publicaciones que contengan el texto en su nombre o descripción
    const publicacionesFiltradas = publicaciones.filter((publicacion) => {
      const nombreMinusculas = publicacion.nombre.toLowerCase();
      const descripcionMinusculas = publicacion.descripcion.toLowerCase();
      return nombreMinusculas.includes(textoMinusculas) || descripcionMinusculas.includes(textoMinusculas);
    });
  
    return publicacionesFiltradas;
  }


obtenerOfertas().then((publicaciones) => {
    crearTarjetaOferta(publicaciones);
});



const botonFiltrar = document.getElementById("btn-filter");
const campoFiltro = document.getElementById("filtro");

function filtrarPublicaciones(publicaciones, texto) {
    // Convertir el texto a minúsculas para una comparación sin distinción entre mayúsculas y minúsculas
    const textoMinusculas = texto.toLowerCase();
  
    // Filtrar las publicaciones que contengan el texto en su nombre o descripción
    const publicacionesFiltradas = publicaciones.filter((publicacion) => {
      const nombreMinusculas = publicacion.nombre.toLowerCase();
      const descripcionMinusculas = publicacion.descripcion.toLowerCase();
      return nombreMinusculas.includes(textoMinusculas) || descripcionMinusculas.includes(textoMinusculas);
    });
  
    return publicacionesFiltradas;
  }
  

botonFiltrar.addEventListener("click", () => {
    // Obtén el texto del filtro
    const textoFiltro = campoFiltro.value;
  
    // Obtén las ofertas
    obtenerOfertas().then((publicaciones) => {
      // Filtra las publicaciones
      const publicacionesFiltradas = filtrarPublicaciones(publicaciones, textoFiltro);
  
      // Limpia el contenedor de tarjetas
      contenedorTarjetas.innerHTML = "";
  
      // Crea las tarjetas de oferta para las publicaciones filtradas
      crearTarjetaOferta(publicacionesFiltradas);
    });
  });