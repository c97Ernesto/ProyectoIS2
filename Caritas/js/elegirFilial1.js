let correoUsuarioPublicacionObjetivo = null;
let idHorario = null;

async function obtenerHorariosDisponibles() {
  const token = localStorage.getItem("token");
  const publicacionId = localStorage.getItem("publicacionId");
  console.log(token);
  console.log(publicacionId);

  try {
    const responsePublicacion = await fetch(
      `http://localhost:3000/publicacion/detalles/${publicacionId}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const publicaciones = await responsePublicacion.json();
    console.log(publicaciones);
    correoUsuarioPublicacionObjetivo = publicaciones[0].fk_usuario_correo;
    console.log(correoUsuarioPublicacionObjetivo);
  } catch (error) {
    console.error("Error al obtener la publicacion:", error);
    return;
  }

  try {
    console.log(correoUsuarioPublicacionObjetivo);
    const responseHorarios = await fetch(
      `http://localhost:3000/usuarios_horarios_predeterminados?correoUsuarioPublicacionObjetivo=${correoUsuarioPublicacionObjetivo}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const data = await responseHorarios.json();

    if (data.success) {
      console.log(data);
      mostrarHorariosDisponibles(data.horarios);
    } else {
      console.error("Error al obtener los horarios disponibles:", data.message);
    }
  } catch (error) {
    console.error("Error al obtener los horarios disponibles:", error);
  }
}

// Función para mostrar los horarios disponibles en un <select>
function mostrarHorariosDisponibles(horarios) {
  const selectHorarios = document.getElementById("selectHorarios");
  selectHorarios.innerHTML = "";

  horarios.forEach((horario) => {
    // if (horario.estado === 'disponible') {
      const option = document.createElement("option");
      option.value = horario.id;
      option.textContent = `Fecha y hora: ${new Date(horario.fechaHora).toLocaleString()} / Filial: ${horario.fk_IdFilial} / estado: ${horario.estado}`;
      selectHorarios.appendChild(option);
    
  });
}

async function verificarDisponibilidad() {
  const token = localStorage.getItem("token");
  const selectHorarios = document.getElementById("selectHorarios");
  const selectedOption = selectHorarios.options[selectHorarios.selectedIndex];
  const idHorario = selectedOption.value;
  console.log("ID del horario seleccionado:", idHorario);

  try {
    const response = await fetch(
      `http://localhost:3000/horario/verificarDisponibilidadHorario?id=${idHorario}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.disponible) {
      console.log("El horario está disponible:", data.horario);
      document.getElementById("resultado").textContent =
        "El horario está disponible.";
    } else {
      console.log("El horario no está disponible:", data.message);
      document.getElementById(
        "resultado"
      ).textContent = `El horario no está disponible: ${data.message}`;
    }
  } catch (error) {
    console.error("Error al verificar la disponibilidad del horario:", error);
    document.getElementById("resultado").textContent =
      "Error al verificar la disponibilidad del horario.";
  }

  try {
    const response = await fetch(
      'http://localhost:3000/horario/confirmarHorarioId',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: idHorario })
      }
    );

    const data = await response.json();

    if (data.success) {
      console.log("El horario ha sido confirmado:", data.horario);
      document.getElementById("resultado").textContent = "El horario ha sido confirmado.";
    } else {
      console.log("Error al confirmar el horario:", data.message);
      document.getElementById("resultado").textContent = `Error al confirmar el horario: ${data.message}`;
    }
  } catch (error) {
    console.error("Error al confirmar el horario:", error);
    document.getElementById("resultado").textContent = "Error al confirmar el horario.";
  }

}

// Llamar a la función para obtener los horarios disponibles al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  obtenerHorariosDisponibles();
  document
    .getElementById("verificarBtn")
    .addEventListener("click", verificarDisponibilidad);
});
