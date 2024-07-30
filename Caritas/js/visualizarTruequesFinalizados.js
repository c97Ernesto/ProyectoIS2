async function obtenerFilial() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Token no encontrado. No se puede obtener la filial del voluntario.");
    return null;
  }

  try {
    const response = await fetch("http://localhost:3000/filial/del-voluntario", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener la filial: " + response.status + " " + response.statusText);
    }

    return await response.json();

  } catch (error) {
    console.error("Error al obtener la filial:", error);
    throw error;
  }
}

async function obtenerTrueques(idFilial){
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Token no encontrado. No se pueden obtener los trueques de la filial.");
    return null;
  }

  try {
    const response = await fetch(`http://localhost:3000/trueques/de-la-filial/${idFilial}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los trueques: " + response.status + " " + response.statusText);
    }

    return await response.json();

  } catch (error) {
    console.error("Error al obtener los trueques:", error);
    throw error;
  }
}

function mostrarTruequesFinalizados(trueques){
  console.log(trueques);

  const tablaTrueques = document.getElementById('trueques-tbody');
  tablaTrueques.innerHTML = '';

  trueques.forEach(t => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${new Date(t.fecha_intercambio).toLocaleString()}</td>
      <td>${t.id_filial}</td>
      <td>${t.estado}</td>
      <td>${t.donacion}</td>
      <td>${t.voluntario}</td>
      <td>${t.dni_ofertante}</td>
      <td>${t.dni_receptor}</td>
    `;
    tablaTrueques.appendChild(fila);
  });

  document.getElementById('total-trueques').innerHTML = `Trueques: ${trueques.length}`
}

document.addEventListener('DOMContentLoaded', async () => {

  const filial = await obtenerFilial();

  if (filial.length === 0){
    alert('El volutnario no se encuentra asignado a una filial.');
  }
  else {
    document.getElementById('nombreFilial').innerHTML = `${filial[0].nombre}`;

    const trueques = await obtenerTrueques(filial[0].id);

    if (trueques.length > 0){
        mostrarTruequesFinalizados(trueques);
    }
    else{
      alert("No se encuentran trueques en la filial.")
    }

  }

  console.log(filial);

  

})