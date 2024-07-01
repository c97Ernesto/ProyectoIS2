let filialesData = []; // Variable para almacenar los datos originales de filiales

// FETCH DATABE
async function obtenerDetallesFiliales() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token no encontrado. No se puede obtener filiales. (visualizarFiliales.js)");
        return null;
    }
    try {
        const response = await fetch("http://localhost:3000/filial/detalles", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });
        if (!response.ok) {
            throw new Error(
                "Error al obtener todos los filiales: " +
                response.status +
                " " +
                response.statusText
            );
        }

        filialesData = await response.json(); // Almacena las filiales obtenidas

        mostrarDetallesFiliales(filialesData);
        // Deshabilitar botones de filtro si no hay filiales
        const filterButtons = document.querySelectorAll('.btn-filter');
        if (filialesData.length === 0) {
            filterButtons.forEach(button => {
                button.disabled = true;
            });
        } else {
            filterButtons.forEach(button => {
                button.disabled = false;
            });
        }

    } catch (error) {
        console.error("Error al obtener las filiales (visualizarFiliales.js):", error);
        throw error;
    }
}


// MOSTRAR LOS DETALLES
function mostrarDetallesFiliales(filiales) {
  const filialesBody = document.getElementById('filiales-body');
  filialesBody.innerHTML = '';

  filiales.forEach(filial => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
          <td>${filial.id}</td>
          <td>${filial.nombre}</td>
          <td>${filial.fk_idUsuarioVoluntario}</td>
          <td><button class="btn btn-outline-primary btn-detalles" data-id="${filial.id}">Editar</button></td>
          <td><button class="btn btn-outline-danger btn-detalles" data-id="${filial.id}">Eliminar</button></td>
      `;
      filialesBody.appendChild(fila);
  });

  
  document.querySelectorAll('.btn-detalles').forEach(button => {
      button.addEventListener('click', event => {
          const filialId = event.target.getAttribute('data-id');
          // window.location.href = `detallesFilial.html?id=${filialId}`;  //CAMBIAR
      });
  });
  document.querySelectorAll('.btn-detalles').forEach(button => {
      button.addEventListener('click', event => {
          const filialId = event.target.getAttribute('data-id');
          // window.location.href = `detallesFilial.html?id=${filialId}`;  //CAMBIAR
      });
  });
}

// EVENTOS
document.addEventListener('DOMContentLoaded', () => {
  obtenerDetallesFiliales();

  const btnFilterId = document.getElementById('btn-filter-idFilial');
  btnFilterId.addEventListener('click', () => {
      const filtroId = document.getElementById('input-filter-idFilial').value.trim().toLowerCase();
      //filtro por id
      const filialesFiltradas = filialesData.filter(filial => filial.id.toLowerCase().includes(filtroId));
      if (filialesFiltradas.length == 0){
          alert("No hay filiales que coincidan con el criterio de búsqueda ingresado.");
          obtenerDetallesFiliales();
      }
      mostrarDetallesFiliales(filialesFiltradas);
  });

  const btnFilterNombreFilial = document.getElementById('btn-filter-nombreFilial');
  btnFilterNombreFilial.addEventListener('click', () => {
      const filtroNombre = document.getElementById('input-filter-nombreFilial').value.trim().toLowerCase();
      //filtro por Nombre
      const filialesFiltradas = filialesData.filter(filial => filial.nombre.toLowerCase().includes(filtroNombre));
      if (filialesFiltradas.length == 0){
          alert("No hay filiales que coincidan con el criterio de búsqueda ingresado.");
          obtenerDetallesFiliales();
      }
      mostrarDetallesFiliales(filialesFiltradas);
  });

  const btnFilterNombrefilial = document.getElementById('btn-filter-correoVoluntario');
  btnFilterNombrefilial.addEventListener('click', () => {
      const filtroCorreoVoluntario = document.getElementById('input-filter-correoVoluntario').value.trim().toLowerCase();
      //filtro por correoVoluntario
      const filialesFiltradas = filialesData.filter(filial => filial.fk_idUsuarioVoluntario.toLowerCase().includes(filtroCorreoVoluntario));
      if (filialesFiltradas.length == 0){
          alert("No hay filiales que coincidan con el criterio de búsqueda ingresado.");
          obtenerDetallesFiliales();
      }
      mostrarDetallesFiliales(filialesFiltradas);
  });
});
