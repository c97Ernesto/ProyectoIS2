// visualizarOfertaEnviada.js
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
        throw new Error(`Error al obtener la oferta: ${ofertaResponse.status} ${ofertaResponse.statusText}`);
      }
  
      const ofertas = await ofertaResponse.json();
      console.log(ofertas);
  
      const { id_producto_ofertante, id_producto_receptor, id_filial } = ofertas[0];
  
      const productoOfertanteResponse = await fetch(`http://localhost:3000/publicacion/detalles/${id_producto_ofertante}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!productoOfertanteResponse.ok) {
        throw new Error(`Error al obtener el producto ofertante: ${productoOfertanteResponse.status} ${productoOfertanteResponse.statusText}`);
      }
  
      const productoOfertante = await productoOfertanteResponse.json();
  
      const productoReceptorResponse = await fetch(`http://localhost:3000/publicacion/detalles/${id_producto_receptor}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!productoReceptorResponse.ok) {
        throw new Error(`Error al obtener el producto receptor: ${productoReceptorResponse.status} ${productoReceptorResponse.statusText}`);
      }
  
      const productoReceptor = await productoReceptorResponse.json();
  
      const filialResponse = await fetch(`http://localhost:3000/filial/detalles/${id_filial}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!filialResponse.ok) {
        throw new Error(`Error al obtener la filial: ${filialResponse.status} ${filialResponse.statusText}`);
      }
  
      const filiales = await filialResponse.json();
  
      mostrarOferta(ofertas[0], productoOfertante[0], productoReceptor[0], filiales[0]);
  
    } catch (error) {
      console.error("Error al obtener la oferta:", error);
      document.getElementById("ofertas-container").innerHTML = "<p>Error al cargar la oferta. Inténtalo de nuevo más tarde.</p>";
    }
  });
  
  function mostrarOferta(oferta, prodOfer, prodRecep, filial) {
    console.log(oferta, prodOfer, prodRecep, filial);
  
    let btnCambiarFilial = '';
    let btnCancelarOferta = '';
    let btnAceptarOferta = '';
  
    if (oferta.estado === 'pendiente') {
      btnCancelarOferta = '<a href="#" id="btn-cancelar" class="btn btn-outline-danger">Cancelar Oferta</a>';
    } else if (oferta.estado === 'aceptada') {
      btnCancelarOferta = '<a href="#" id="btn-cancelar" class="btn btn-outline-danger">Cancelar Oferta</a>';
      
    }
  
    const ofertasContainer = document.getElementById("ofertas-container");
    ofertasContainer.innerHTML = ""; // Limpiar contenido previo
    const ofertaElement = document.createElement("div");
    ofertaElement.innerHTML = `
      <div class="card-group">
        <div class="card">
          <img src="${prodOfer.imagenes}" class="card-img-top d-block mx-auto" style="width: 250px; height: 300px;" alt="...">
          <div class="card-body">
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
          <p class="">Categoría: ${prodOfer.categoria}</p>
          <p class="">Filial: ${filial.nombre}</p>
          <p class="">Fecha: ${new Date(oferta.fecha_intercambio).toLocaleString()}</p>
          <div class="text-center">
            ${btnCancelarOferta}
          </div>
        </div>
      </div>
    `;
    ofertasContainer.appendChild(ofertaElement);
  
    // Eventos para los botones de rechazar, cambiar y aceptar
    document.getElementById("btn-aceptar")?.addEventListener("click", () => handleAccept(oferta.id));
    document.getElementById("btn-rechazar")?.addEventListener("click", () => handleReject(oferta.id));
    document.getElementById("btn-cancelar")?.addEventListener("click", () => handleReject(oferta.id));
    document.getElementById("btn-cambiarFilial")?.addEventListener("click", () => handleFilialChange(oferta.id));
  
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
  
    function handleFilialChange(ofertaId) {
      console.log("Filial change clicked for ofertaId:", ofertaId);
      // Implementar lógica de cambio de filial aquí
    }
  }
  