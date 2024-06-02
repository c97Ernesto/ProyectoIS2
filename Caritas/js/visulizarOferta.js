document.addEventListener("DOMContentLoaded", async () => {

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token no encontrado en localStorage");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const ofertaId = urlParams.get("id");
  

  try {
    const ofertaResponse = await fetch(`http://localhost:3000/ofertas/detalles/${ofertaId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!ofertaResponse.ok) {
        throw new Error(
          `Error al obtener la oferta: ${ofertaResponse.status} ${ofertaResponse.statusText}`
        );
      }

    const ofertas = await ofertaResponse.json();
    console.log(ofertas);
    const oferta = ofertas[0];


    // const idProductoOfertante = oferta.id_producto_ofertante
    // const idProductoReceptor = oferta.id_producto_receptor
    // const idFilial = oferta.id_filial

    // const productoOfertanteResponse = await fetch(`http://localhost:3000/publicacion/detalles/${idProductoOfertante}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    // if (!productoOfertanteResponse.ok) {
    //   throw new Error(
    //     `Error al obtener el producto ofertante: ${productoOfertanteResponse.status} ${productoOfertanteResponse.statusText}`
    //   );
    // }

    // const productoOfertante = await productoOfertanteResponse.json();
    // console.log(productoOfertante);

    // // Obtener detalles del producto receptor
    // const productoReceptorResponse = await fetch(
    //   `http://localhost:3000/publicacion/detalles/${idProductoReceptor}`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );

    // if (!productoReceptorResponse.ok) {
    //   throw new Error(
    //     `Error al obtener el producto receptor: ${productoReceptorResponse.status} ${productoReceptorResponse.statusText}`
    //   );
    // }

    // const productoReceptor = await productoReceptorResponse.json();
    // console.log(productoReceptor)

    mostrarOferta(oferta);

    

  } catch (error) {
    console.error("Error al obtener la oferta:", error);
    document.getElementById("ofertas-container").innerHTML =
      "<p>Error al cargar la oferta. Inténtalo de nuevo más tarde.</p>";
  }
});

function mostrarOferta(oferta) {
  const ofertasContainer = document.getElementById("ofertas-container");
  ofertasContainer.innerHTML = ""; // Limpiar contenido previo
  const ofertaElement = document.createElement("div");
  ofertaElement.innerHTML = `
    <div class="card-group">
        <div class="card">
            <img src="..." class="card-img-top" alt="...">
            <div class="card-body" >
                <h5 class="card-title">Nombre del Producto: </h5>
                <p class="card-text">Nombre del Ofertante: ${oferta.nombre_ofertante}</p>
                <p class="card-text">Dni del Ofertante: ${oferta.dni_ofertante}</p>
            </div>
        </div>
        <div class="card">
            <img src="..." class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">Nombre del Producto: </h5>
                <p class="card-text">Nombre del Receptor: ${oferta.nombre_receptor}</p>
                <p class="card-text">Dni del Receptor: ${oferta.dni_receptor}</p>
            </div>
        </div>
    </div>
    <div class="card mt-2">
    <div class="card-body">
                <div class="card-header">Estado de la Oferta: ${oferta.estado}</div>
                <p class="card-text">Filial: </p>
                <p class="card-text">Fecha: </p>
                <div class="text-center ">
                    <a href="#" class="btn btn-outline-dark">Cambiar Filial</a>
                    <a href="#" class="btn btn-outline-primary">Aceptar</a>
                    <a href="#" class="btn btn-outline-danger">Rechazar</a>
                </div>
            </div>
    </div>
    `;
    ofertasContainer.appendChild(ofertaElement);
}

{
        
}

