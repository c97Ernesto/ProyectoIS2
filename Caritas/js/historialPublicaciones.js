// En el cliente
document.addEventListener('DOMContentLoaded', () => {
    const publicacionesContainer = document.getElementById('publicacionesContainer');
    let publicacionesSet = new Set(); // Conjunto para almacenar IDs de publicaciones

    // Función para obtener y mostrar las publicaciones
    function mostrarPublicaciones() {
        fetch('http://localhost:3000/publicaciones')
            .then(response => response.json())
            .then(data => {
                // Limpiar el contenedor antes de agregar las nuevas publicaciones
                publicacionesContainer.innerHTML = '';
                publicacionesSet.clear(); // Limpiar el conjunto de IDs

                // Iterar sobre cada publicación y crear elementos HTML para mostrarlas
                data.forEach(publicacion => {
                    // Verificar si la publicación ya ha sido agregada
                    if (!publicacionesSet.has(publicacion.id)) {
                        publicacionesSet.add(publicacion.id); // Agregar ID al conjunto
                        const publicacionDiv = document.createElement('div');
                        publicacionDiv.classList.add('publicacion');

                        // Construir el contenido de la publicación
                        let contenidoHTML = `<h2>${publicacion.nombre}</h2>`;
                        contenidoHTML += `<p><strong>Descripción:</strong> ${publicacion.descripcion}</p>`;
                        contenidoHTML += `<p><strong>Estado:</strong> ${publicacion.estado}</p>`;
                        contenidoHTML += `<p><strong>Imágenes:</strong></p>`;

                        // Verificar si existe publicacion.imagenes y es un array con al menos una imagen
                        if (Array.isArray(publicacion.imagenes) && publicacion.imagenes.length > 0) {
                            // Iterar sobre las imágenes y agregarlas al contenido HTML
                            publicacion.imagenes.forEach(imagen => {
                                contenidoHTML += `<img src="${imagen}" alt="Imagen">`;
                            });
                        } else {
                            contenidoHTML += `<p>No hay imágenes disponibles</p>`;
                        }

                        contenidoHTML += `<p><strong>Usuario:</strong> ${publicacion.fk_usuario_correo}</p>`;

                        // Agregar el contenido HTML al contenedor de publicaciones
                        publicacionDiv.innerHTML = contenidoHTML;
                        publicacionesContainer.appendChild(publicacionDiv);
                    }
                });
            })
            .catch(error => {
                console.error('Error al obtener las publicaciones:', error);
                alert('Error al obtener las publicaciones.');
            });
    }

    // Mostrar las publicaciones al cargar la página
    mostrarPublicaciones();
});
