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

// Función para verificar la disponibilidad
async function verificarDisponibilidad() {
  const fechaHoraSeleccionada = obtenerFechaSeleccionada();
  const filialSeleccionada = document.getElementById('filiales').value;

  console.log(fechaHoraSeleccionada);
  console.log(filialSeleccionada);

  try {
      // Hacer una solicitud al servidor para verificar la disponibilidad
      const response = await fetch(`http://localhost:3000/horario/verificarHorario?fechaHora=${fechaHoraSeleccionada}&filial=${filialSeleccionada}`);
      const data = await response.json();

      const resultadoDiv = document.getElementById('resultado');
      if (data.disponible) {
          resultadoDiv.textContent = 'El horario y filial seleccionados están disponibles.';
      } else {
          resultadoDiv.textContent = data.message;
      }
  } catch (error) {
      console.error('Error al verificar la disponibilidad:', error);
  }
}

// Función para confirmar la reserva de la filial
async function confirmarFilial() {
  const fechaHoraSeleccionada = obtenerFechaSeleccionada();
  const filialSeleccionada = document.getElementById('filiales').value;

  try {
      const response = await fetch('http://localhost:3000/horario/confirmar', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              fechaHora: fechaHoraSeleccionada,
              filial: filialSeleccionada,
          }),
      });

      const data = await response.json();

      if (data.success) {
          alert('La reserva se ha realizado con éxito.');
          location.reload(); // Recargar la página
      } else {
          alert(data.message);
      }
  } catch (error) {
      console.error('Error al confirmar la reserva:', error);
  }
}

// Llamar a las funciones para generar las opciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  obtenerFiliales();
  document.getElementById('fechaHora').addEventListener('change', verificarDisponibilidad);
  document.getElementById('filiales').addEventListener('change', verificarDisponibilidad);
  document.getElementById('confirmarFilial').addEventListener('click', confirmarFilial);
});
