// Función para obtener la fecha y hora seleccionadas
function obtenerFechaSeleccionada() {
  const inputFechaHora = document.getElementById('fechaHora');
  const fechaHoraSeleccionada = inputFechaHora.value.replace('T', ' '); // Reemplazar 'T' con un espacio
  return fechaHoraSeleccionada;
}

// Función para obtener las filiales
async function obtenerFiliales() {
  try {
      const response = await fetch('http://localhost:3000/filial');
      const filiales = await response.json();

      const select = document.getElementById('filiales');
      filiales.forEach(filial => {
          const option = document.createElement('option');
          option.value = filial.id; // Suponiendo que cada filial tiene un ID único
          option.textContent = filial.nombre; // Suponiendo que cada filial tiene un nombre
          select.appendChild(option);
      });
  } catch (error) {
      console.error('Error al obtener las filiales:', error);
  }
}

let horarioSeleccionado = null
// Función para verificar la disponibilidad
async function verificarDisponibilidad() {
  const fechaHoraSeleccionada = obtenerFechaSeleccionada();
  const filialSeleccionada = document.getElementById('filiales').value;

  console.log(fechaHoraSeleccionada);
  console.log(filialSeleccionada);

  try {
      // Hacer una solicitud al servidor para verificar la disponibilidad
      const response = await fetch(`http://localhost:3000/horario/verificarHorarios?fechaHora=${fechaHoraSeleccionada}&filial=${filialSeleccionada}`);
      const data = await response.json();
      console.log(data);

      const resultadoDiv = document.getElementById('resultado');
      if (data.disponible) {
          horarioSeleccionado = data.horario;
          resultadoDiv.textContent = 'El horario y filial seleccionados están disponibles.';
      } else {
          resultadoDiv.textContent = data.message;
      }

      // Mostrar detalles del horario si existen
      if (data.horario) {
          resultadoDiv.textContent += `\nDetalles del horario:\nID: ${data.horario.id}\nFecha y Hora: ${data.horario.fechaHora}\nEstado: ${data.horario.estado}`;
      }
  } catch (error) {
      console.error('Error al verificar la disponibilidad:', error);
  }
}

// Función para confirmar la reserva de la filial
async function establecerHorarioPredeterminado() {
  if (!horarioSeleccionado) {
      console.error('No se ha seleccionado un horario para establecer como predeterminado.');
      return;
  }

  const token = localStorage.getItem("token");
  try {
      const response = await fetch('http://localhost:3000/usuarios_horarios_predeterminados', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
              horario: horarioSeleccionado, // Enviar el horario seleccionado
          }),
      });

      const data = await response.json();

      if (data.success) {
          alert('El horario predeterminado se ha establecido con éxito.');
          location.reload(); // Recargar la página
      } else {
          alert(data.message);
      }

      // Mostrar detalles del horario si existen
      if (data.horario) {
          const resultadoDiv = document.getElementById('resultado');
          resultadoDiv.textContent = `\nDetalles del horario:\nID: ${data.horario.id}\nFecha y Hora: ${data.horario.fechaHora}\nEstado: ${data.horario.estado}`;
      }
  } catch (error) {
      console.error('Error al establecer el horario predeterminado:', error);
  }
}

// Llamar a las funciones para generar las opciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  obtenerFiliales();
  document.getElementById('fechaHora').addEventListener('change', verificarDisponibilidad);
  document.getElementById('filiales').addEventListener('change', verificarDisponibilidad);
  document.getElementById('confirmarFilial').addEventListener('click', establecerHorarioPredeterminado);
});
