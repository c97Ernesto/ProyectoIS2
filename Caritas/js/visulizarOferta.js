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

function mostrarOferta(oferta, prodOfer, prodRecep, filial) {

  let btnCambiarFilial;
  let btnCancelarOferta;
  let btnAceptarOferta;
  if (oferta.estado === 'esperando') {
    btnCambiarFilial = '';
    actionButtonHTML = '<a href="#" class="btn btn-outline-dark">Cambiar Filial</a>';
    btnAceptarOferta = '<a href="#" class="btn btn-outline-primary">Aceptar Oferta</a>'
    btnCancelarOferta = '<a href="#" class="btn btn-outline-danger">Rechazar Oferta</a>';
  } else if (oferta.estado === 'aceptado') {
    btnCambiarFilial = '<div><a href="#" class="btn btn-outline-dark">Cambiar Filial</a></div>';
    btnAceptarOferta = ''
    btnCancelarOferta = '<a href="#" class="btn btn-outline-danger">Cancelar Oferta</a>';
  } else {
    actionButtonHTML = ''; // If there's no action for other states, leave it empty
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
                <p class="card-text">Nombre del Ofertante: ${oferta.nombre_ofertante}</p>
                <p class="card-text">Dni del Ofertante: ${oferta.dni_ofertante}</p>
            </div>
        </div>
        <div class="card">
            <img src="${prodRecep.imagenes}" class="card-img-top d-block mx-auto" style="width: 250px; height: 300px;" alt="...">
            <div class="card-body">
                <p class="card-text">Nombre del Producto: ${prodRecep.imagenes}</p>
                <p class="card-text">Nombre del Receptor: ${oferta.nombre_receptor}</p>
                <p class="card-text">Dni del Receptor: ${oferta.dni_receptor}</p>
            </div>
        </div>
    </div>
    <div class="card mt-2">
    <div class="card-body">
                <div class="card-header">Estado de la Oferta: ${oferta.estado}</div>
                <div class="d-flex align-items-center ">
                  <div class="me-5">
                    <p class="card-text">Filial: Acá iría el nombre de la filial${filial.nombre}</p>
                  </div>
                  ${btnCambiarFilial}
                </div>
                <p class="card-text">Fecha: ${oferta.fecha_intercambio}</p>
                <div class="text-center ">
                    ${btnAceptarOferta}
                    ${btnCancelarOferta}
                </div>
            </div>
    </div>
    `;
    ofertasContainer.appendChild(ofertaElement);
}

document.getElementById("btn-changeFilial").addEventListener('click', () => {
  console.log("click")
});

