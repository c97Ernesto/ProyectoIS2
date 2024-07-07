let filialesData = []; // Variable para almacenar los datos originales de filiales

// FETCH DATABASE
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
                "Error al obtener todos los filiales: " + response.status + " " + response.statusText
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
      await eliminarOfertasDeFilial(filialId);

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

async function obtenerOfertasFilial(filialId) {
    const token = localStorage.getItem("token");
    console.log("antes fetch", filialId);
    try {
        const response = await fetch(`http://localhost:3000/ofertas/ofertas-por-filial/${filialId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });
        if (!response.ok) {
            throw new Error(`Error al obtener las ofertas de la filial con id "${filialId}": ${response.status} ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error al obtener la filial:", error);
    }
}

async function eliminarOfertasDeFilial(filialId) {
    const token = localStorage.getItem("token");
  
    try {
        const response = await fetch(`http://localhost:3000/ofertas/ofertas-por-filial/${filialId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });
        if (!response.ok) {
            throw new Error(`Error al eliminar las ofertas de la filial ${filialId}: ${response.status} ${response.statusText}`);
        }
        await obtenerDetallesFiliales();
    } catch (error) {
        console.error("Error al eliminar las ofertas de la filial:", error);
    }
}

async function obtenerVoluntariosDeFilial(filialId) {
    const token = localStorage.getItem("token");
    console.log("antes fetch", filialId);
    try {
        const response = await fetch(`http://localhost:3000/filialVoluntario/voluntarios-de-filial/${filialId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });
        if (!response.ok) {
            throw new Error(`Error al obtener los voluntarios de la filial con id "${filialId}": ${response.status} ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error al obtener los voluntarios de la filial:", error);
    }
}

// MOSTRAR LOS DETALLES
function mostrarDetallesFiliales(filiales) {
    const filialesBody = document.getElementById('filiales-body');
    filialesBody.innerHTML = '';

    filiales.forEach(async filial => {
        const filial_voluntario = await obtenerVoluntariosDeFilial(filial.id);
        const cantVoluntarios = filial_voluntario.length;

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${filial.id}</td>
            <td>${filial.nombre}</td>
            <td>${cantVoluntarios}</td>
            <td><button class="btn btn-outline-primary btn-detalles" data-id="${filial.id}">Editar</button></td>
            <td>
                <button type="button" class="btn btn-outline-danger btn-eliminar" data-id="${filial.id}" data-nombre="${filial.nombre}"
                data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Eliminar
                </button>
            </td>
        `;
        filialesBody.appendChild(fila);
    });

    const thCantFiliales = document.getElementById('total-filiales');
    thCantFiliales.innerHTML = `Filiales encontradas: ${filiales.length}`;
}


document.addEventListener('DOMContentLoaded', () => {
    obtenerDetallesFiliales();

    const filialesBody = document.getElementById('filiales-body');
    filialesBody.addEventListener('click', async event => {
        if (event.target.classList.contains('btn-eliminar')) {
            const filialId = event.target.getAttribute('data-id');
            const filialNombre = event.target.getAttribute('data-nombre');

            // Asignar el ID de la filial al botón de confirmación de eliminación
            document.getElementById('confirmarEliminar').setAttribute('data-id', filialId);

            // Actualizar el contenido del modal con el nombre de la filial
            document.getElementById('filialNameToDelete').textContent = filialNombre;

            // Obtener las ofertas de la filial
            try {
                const ofertasData = await obtenerOfertasFilial(filialId);
                console.log('Ofertas obtenidas:', ofertasData);
                const ofertasAceptadas = ofertasData.filter(oferta => oferta.estado === 'aceptado');
                document.getElementById('cant-ofertas-filial').textContent = ofertasAceptadas.length;
            } catch (error) {
                console.error('Error al obtener las ofertas:', error);
            }
        }
    });

    const btnFilterId = document.getElementById('btn-filter-idFilial');
    btnFilterId.addEventListener('click', () => {
        const filtroId = document.getElementById('input-filter-idFilial').value.trim();
        const filialesFiltradas = filialesData.filter(filial => filial.id == filtroId);

        if (filialesFiltradas.length == 0) {
            alert("No hay filiales que coincidan con el criterio de búsqueda ingresado.");
            obtenerDetallesFiliales();
        } else {
            mostrarDetallesFiliales(filialesFiltradas);
        }
        document.getElementById('input-filter-idFilial').value = '';
    });

    const btnFilterNombreFilial = document.getElementById('btn-filter-nombreFilial');
    btnFilterNombreFilial.addEventListener('click', () => {
        const filtroNombre = document.getElementById('input-filter-nombreFilial').value.trim().toLowerCase();
        const filialesFiltradas = filialesData.filter(filial => filial.nombre.toLowerCase().includes(filtroNombre));
        if (filialesFiltradas.length == 0) {
            alert("No hay filiales que coincidan con el criterio de búsqueda ingresado.");
            obtenerDetallesFiliales();
        } else {
            mostrarDetallesFiliales(filialesFiltradas);
        }
        document.getElementById('input-filter-nombreFilial').value = '';
    });

    const btnFilterCorreoVoluntario = document.getElementById('btn-filter-correoVoluntario');
    btnFilterCorreoVoluntario.addEventListener('click', () => {
        const filtroCorreoVoluntario = document.getElementById('input-filter-correoVoluntario').value.trim().toLowerCase();
        const filialesFiltradas = filialesData.filter(filial => 
            filial.filial_voluntarios && filial.filial_voluntarios.some(voluntario => 
                voluntario.voluntario && voluntario.voluntario.correo.toLowerCase().includes(filtroCorreoVoluntario)
            )
        );
        if (filialesFiltradas.length == 0) {
            alert("No hay filiales que coincidan con el criterio de búsqueda ingresado.");
            obtenerDetallesFiliales();
        } else {
            mostrarDetallesFiliales(filialesFiltradas);
        }
        document.getElementById('input-filter-correoVoluntario').value = '';
    });

    const btnEliminarFilial = document.getElementById('confirmarEliminar');
    btnEliminarFilial.addEventListener('click', async () => {
        const filialId = btnEliminarFilial.getAttribute('data-id');
        console.log('ID de la filial a eliminar:', filialId);

        if (filialId) {
            try {
                await eliminarFilial(filialId);
                obtenerDetallesFiliales(); // Llamar a obtenerDetallesFiliales() después de eliminar una filial
            } catch (error) {
                console.error('Error al eliminar la filial:', error);
            }
        }
    });
});
