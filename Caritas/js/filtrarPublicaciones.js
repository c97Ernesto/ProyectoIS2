// Módulo para obtener publicaciones
async function obtenerPublicaciones(url, headers = {}) {
  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Error al obtener las publicaciones: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener las publicaciones:", error);
    throw error;
  }
}

async function obtenerTodasLasPublicaciones() {
  const token = localStorage.getItem("token");

  if (!token) {
    return obtenerPublicaciones("http://localhost:3000/publicacion/");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };

  return obtenerPublicaciones("http://localhost:3000/publicacion/publicacionesAgenas", headers);
}

// Módulo para crear tarjetas de publicaciones
function crearTarjetaPublicacion(publicaciones, contenedor) {
  contenedor.innerHTML = "";

  publicaciones.forEach((publicacion) => {
    const nuevaPublicacion = document.createElement("div");
    nuevaPublicacion.classList = "col p-2 d-flex justify-content-center";
    nuevaPublicacion.innerHTML = `
      <div class="card" style="width: 18rem;">
        <img src="${publicacion.imagenes}" style="max-width: 100%; height: auto; aspect-ratio: 1.5;" alt="...">
        <div class="card-body">
          <h5 class="card-title">${publicacion.nombre}</h5>
          <p class="card-text">${publicacion.descripcion}.</p>
          <div class="text-center">
            <button data-id="${publicacion.id}" class="btn btn-primary">Ver publicación</button>
          </div>
        </div>
      </div>
    `;

    const boton = nuevaPublicacion.querySelector('button');
    boton.addEventListener('click', () => {
      const publicacionId = boton.getAttribute('data-id');
      verPublicacion(publicacionId);
    });

    contenedor.appendChild(nuevaPublicacion);
  });
}

// Módulo para ver una publicación
async function verPublicacion(publicacionId) {
  const token = localStorage.getItem("token");
  let url = `http://localhost:3000/publicacion/${publicacionId}`;
  let headers = {};

  if (token) {
    url = `http://localhost:3000/publicacion/buscarPublicacionesAutenticado/${encodeURIComponent(publicacionId)}`;
    headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };
  }

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error("Error al obtener los detalles de la publicación");
    }
    const contenido = await response.text();
    localStorage.setItem("detallePublicacion", contenido);
    localStorage.setItem("publicacionId", publicacionId);
    window.location.href = `./verDetallePublicacion.html`;
  } catch (error) {
    console.error("Error al obtener los detalles de la publicación:", error);
  }
}

// Módulo para filtrar publicaciones
function filtrarPublicaciones(publicaciones, criterio, valor) {
  if (criterio === "nombre") {
    const valorMinusculas = valor.toLowerCase();
    return publicaciones.filter((publicacion) => 
      publicacion.nombre.toLowerCase().includes(valorMinusculas) || 
      publicacion.descripcion.toLowerCase().includes(valorMinusculas)
    );
  }

  if (criterio === "estado") {
    return publicaciones.filter((publicacion) => publicacion.estado === valor);
  }

  return publicaciones;
}

// Eventos
document.addEventListener('DOMContentLoaded', () => {
  const contenedorTarjetas = document.getElementById("publicacionesAgenas-container");

  document.getElementById("btn-filter-name").addEventListener("click", () => {
    const textoFiltro = document.getElementById("input-filter-name").value;
    manejarFiltrado(contenedorTarjetas, "nombre", textoFiltro);
  });

  document.getElementById("btn-filter-state").addEventListener("click", () => {
    const estadoFiltro = document.getElementById("select-filter-state").value;
    manejarFiltrado(contenedorTarjetas, "estado", estadoFiltro);
  });

  obtenerTodasLasPublicaciones().then((publicaciones) => {
    crearTarjetaPublicacion(publicaciones, contenedorTarjetas);
  });
});

// Filtrado de publicaicones
function manejarFiltrado(contenedor, criterio, valor) {
  obtenerTodasLasPublicaciones().then((publicaciones) => {
    const publicacionesFiltradas = filtrarPublicaciones(publicaciones, criterio, valor);

    if (publicacionesFiltradas.length === 0) {
      alert('No hay publicaciones que coincidan con el criterio de búsqueda ingresado.');
      obtenerTodasLasPublicaciones().then((todasLasPublicaciones) => {
        crearTarjetaPublicacion(todasLasPublicaciones, contenedor);
      });
    } 
    else {
      crearTarjetaPublicacion(publicacionesFiltradas, contenedor);
    }
  });
}
