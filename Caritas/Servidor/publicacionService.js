
async function obtenerPublicacionPorId(id) {
  try {
    const res = await fetch(`http://localhost:3000/publicacion/${id}`);
    if (!res.ok) {
      throw new Error(
        `Error al obtener la publicación: ${res.status} ${res.statusText}`
      );
    }
    const results = await res.json();
    const jsonData = {
      id: results[0].id,
      nombre: results[0].nombre,
      descripcion: results[0].descripcion,
      imagenes: results[0].imagenes,
      estado: results[0].estado,
      categoria: results[0].categoria,
    };
    return jsonData;
  } catch (error) {
    console.error("Error al obtener la publicación:", error);
    throw error; //
  }
}

async function getPublicaciones() {
  const res = fetch("http://localhost:3000/publicacion");
}
