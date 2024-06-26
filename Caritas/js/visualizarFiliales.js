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

async function eliminarFilial(filialId) {
  const token = localStorage.getItem("token");

  console.log(filialId);

  try {
      const response = await fetch(`http://localhost:3000/filial/eliminar/${filialId}`, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
          },
      });

      if (!response.ok) {
          throw new Error(`Error al eliminar la filial: ${response.status} ${response.statusText}`);
      }

      alert("Filial eliminada exitosamente!")
      // Obtener los detalles actualizados de las filiales
      await obtenerDetallesFiliales();


  } catch (error) {
      console.error("Error al eliminar la filial:", error);
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
          <td>
            <button type="button" class="btn btn-outline-danger btn-detalles btn-eliminar" data-id="${filial.id}" 
            data-bs-toggle="modal" data-bs-target="#exampleModal">
              Eliminar
            </button>
          </td>
</button>
      `;
      filialesBody.appendChild(fila);
  });

  const thCantFiliales = document.getElementById('total-filiales');
  thCantFiliales.innerHTML = `Filiales encontradas: ${filiales.length}`;
  
  document.querySelectorAll('.btn-detalles').forEach(button => {
      button.addEventListener('click', event => {
          const filialId = event.target.getAttribute('data-id');
          // window.location.href = `detallesFilial.html?id=${filialId}`;  //CAMBIAR
      });
  });

  document.querySelectorAll('.btn-eliminar').forEach(button => {
    button.addEventListener('click', event => {
        const filialId = event.target.getAttribute('data-id');
        // Asignar el ID de la filial al botón de confirmación de eliminación
        document.getElementById('confirmarEliminar').setAttribute('data-id', filialId);
    });
  });
}

// EVENTOS
document.addEventListener('DOMContentLoaded', () => {
  obtenerDetallesFiliales();

  const btnFilterId = document.getElementById('btn-filter-idFilial');
  btnFilterId.addEventListener('click', () => {
      const filtroId = document.getElementById('input-filter-idFilial').value.trim();
      const filialesFiltradas = filialesData.filter(filial => filial.id == filtroId);

      if (filialesFiltradas.length == 0){
          alert("No hay filiales que coincidan con el criterio de búsqueda ingresado.");
          obtenerDetallesFiliales();
      }
      else {
        mostrarDetallesFiliales(filialesFiltradas);
      }
      document.getElementById('input-filter-idFilial').value = '';
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
      else {
        mostrarDetallesFiliales(filialesFiltradas);
      }
      document.getElementById('input-filter-nombreFilial').value = '';
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
      else {
        mostrarDetallesFiliales(filialesFiltradas);
      }
      document.getElementById('input-filter-correoVoluntario').value = '';
  });
});


document.getElementById('confirmarEliminar').addEventListener('click', event => {
  const filialId = event.target.getAttribute('data-id');
  console.log(filialId);
  eliminarFilial(filialId);
});