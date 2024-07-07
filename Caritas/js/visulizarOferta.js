//visualizarOferta.js
document.addEventListener("DOMContentLoaded", async () => {

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token no encontrado en localStorage");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const ofertaId = urlParams.get("id");

  try {
    const ofertaResponse = await fetch(
      `http://localhost:3000/ofertas/detalles/${ofertaId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!ofertaResponse.ok) {
      throw new Error(
        `Error al obtener la oferta: ${ofertaResponse.status} ${ofertaResponse.statusText}`
      );
    }

    const ofertas = await ofertaResponse.json();
    console.log(ofertas);


    const idProductoOfertante = ofertas[0].id_producto_ofertante;
    const idProductoReceptor = ofertas[0].id_producto_receptor;
    const idFilial = ofertas[0].id_filial;

    const productoOfertanteResponse = await fetch(
      `http://localhost:3000/publicacion/detalles/${idProductoOfertante}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!productoOfertanteResponse.ok) {
      throw new Error(
        `Error al obtener el producto ofertante: ${productoOfertanteResponse.status} ${productoOfertanteResponse.statusText}`
      );
    }
    const productoOfertante = await productoOfertanteResponse.json();


    const productoReceptorResponse = await fetch(
      `http://localhost:3000/publicacion/detalles/${idProductoReceptor}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!productoReceptorResponse.ok) {
      throw new Error(
        `Error al obtener el producto receptor: ${productoReceptorResponse.status} ${productoReceptorResponse.statusText}`
      );
    }
    const productoReceptor = await productoReceptorResponse.json();


    const filialResponse = await fetch(
      `http://localhost:3000/filial/detalles/${idFilial}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!filialResponse.ok) {
      throw new Error(
        `Error al obtener la filial: ${filialResponse.status} ${filialResponse.statusText}`
      );
    }
    filiales = await filialResponse.json();

    mostrarOferta(ofertas[0], productoOfertante[0], productoReceptor[0], filiales[0]);

  } catch (error) {
    console.error("Error al obtener la oferta:", error);
    document.getElementById("ofertas-container").innerHTML =
      "<p>Error al cargar la oferta. Inténtalo de nuevo más tarde.</p>";
  }
});


function formatFecha(fechaISO) {
  const fecha = new Date(fechaISO);

  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
  const año = fecha.getFullYear();

  const horas = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');

  return `${dia}/${mes}/${año} ${horas}:${minutos}`;
}

function mostrarOferta(oferta, prodOfer, prodRecep, filial) {

  console.log(oferta);
  console.log(prodOfer);
  console.log(prodRecep);
  console.log(filial);


  let btnCambiarFilial = '';
  let btnCancelarOferta = '';
  let btnAceptarOferta = '';
  if (oferta.estado === 'pendiente') {
    btnCambiarFilial = '<a href="#" id="btn-cambiarFilial" class="btn btn-outline-dark">Cambiar Filial</a>';
    btnAceptarOferta = '<a href="#" id="btn-aceptar" class="btn btn-outline-primary">Aceptar Oferta</a>'
    btnCancelarOferta = '<a href="#" id="btn-rechazar" class="btn btn-outline-danger">Rechazar Oferta</a>';

  } else if (oferta.estado === 'aceptada') {
    btnCambiarFilial = '<a href="#" id="btn-cambiarFilial" class="btn btn-outline-dark">Cambiar Filial</a>';
    btnAceptarOferta = ''
    btnCancelarOferta = '<a href="#" id="btn-cancelar" class="btn btn-outline-danger">Cancelar Oferta</a>';
  }

  const ofertasContainer = document.getElementById("ofertas-container");
  ofertasContainer.innerHTML = ""; // Limpiar contenido previo
  const ofertaElement = document.createElement("div");
  ofertaElement.innerHTML = `
    <div class="card-group">
        <div class="card">
            <img src="${prodOfer.imagenes}" class="card-img-top d-block mx-auto" style="width: 250px; height: 300px;" alt="...">
            <div class="card-body" >
                <p class="card-title">Nombre del Producto: ${prodOfer.nombre}</p>
                <p class="card-text">Descripción: ${prodOfer.descripcion}</p>
                <p class="card-text">Estado: ${prodOfer.estado}</p>
                <p class="card-text">Nombre del Ofertante: ${oferta.nombre_ofertante}</p>
                <p class="card-text">Dni del Ofertante: ${oferta.dni_ofertante}</p>
            </div>
        </div>
        <div class="card">
            <img src="${prodRecep.imagenes}" class="card-img-top d-block mx-auto" style="width: 250px; height: 300px;" alt="...">
            <div class="card-body">
                <p class="card-text">Nombre: ${prodRecep.nombre}</p>
                <p class="card-text">Descripción: ${prodRecep.descripcion}</p>
                <p class="card-text">Estado: ${prodRecep.estado}</p>
                <p class="card-text">Nombre del Receptor: ${oferta.nombre_receptor}</p>
                <p class="card-text">Dni del Receptor: ${oferta.dni_receptor}</p>
            </div>
        </div>
    </div>
    <div class="card mt-2">
        <div class="card-body">
            <div class="card-header">Estado de la Oferta: ${oferta.estado}</div>
                <p class=""></p>
                <p class="">Categoría: ${prodOfer.categoria}</p>
                <p class="">Filial: ${filial.nombre}</p>
                <p class="">Fecha: ${new Date(oferta.fecha_intercambio).toLocaleString()}</p>
            <div class="text-center">
                ${btnAceptarOferta}
                ${btnCancelarOferta}
            </div>
        </div>
    </div>
    `;
  ofertasContainer.appendChild(ofertaElement);
  // Event listeners for accept and reject buttons
  if (document.getElementById("btn-aceptar")) {
    document.getElementById("btn-aceptar").addEventListener("click", () => handleAccept(oferta.id));
  }
  if (document.getElementById("btn-rechazar")) {
    document.getElementById("btn-rechazar").addEventListener("click", () => handleReject(oferta.id));
  }
  if (document.getElementById("btn-cancelar")) {
    document.getElementById("btn-cancelar").addEventListener("click", () => handleReject(oferta.id));
  }
  if (document.getElementById("btn-cambiarFilial")) {
    document.getElementById("btn-cambiarFilial").addEventListener("click", () => handleFilialChange(oferta.id));
  }

  async function handleAccept(ofertaId) {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado en localStorage");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/ofertas/aceptar/${ofertaId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al aceptar la oferta: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result.message);

      // Mostrar mensaje de éxito
      alert("Oferta aceptada exitosamente");


      // Recargar la página para reflejar los cambios

      window.location.reload();

    } catch (error) {
      console.error("Error al aceptar la oferta:", error);
    }
  }

  async function handleReject(ofertaId) {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado en localStorage");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/ofertas/rechazar/${ofertaId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al rechazar la oferta: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result.message);

      // Mostrar mensaje de éxito
      alert("Oferta rechazada exitosamente");

      // Recargar la página para reflejar los cambios
      window.location.reload();


    } catch (error) {
      console.error("Error al rechazar la oferta:", error);
    }
  }

  async function handleFilialChange(ofertaId) {
    console.log("Filial change clicked for ofertaId:", ofertaId);
    // Implementar lógica de cambio de filial aquí
  }

}
