document.addEventListener('DOMContentLoaded', () => {
    // Función para validar la URL de las imágenes
    function isValidURL(url) {
        // Patrón para verificar si es una URL válida
        const pattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
        return pattern.test(url);
    }

    // Función para editar la publicación
    function editarPublicacion() {
        // Obtener los valores de los campos del formulario
        const nombre = document.getElementById('nombre').value;
        const descripcion = document.getElementById('descripcion').value;
        const imagenes = document.getElementById('imagenes').value;
        const estado = document.getElementById('estado').value;

        // Verificar que todos los campos estén completos
        if (!nombre || !descripcion || !imagenes || !estado ) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Validar la URL de las imágenes
        if (!isValidURL(imagenes)) {
            alert('La URL de las imágenes no es válida.');
            return;
        }
        const id = localStorage.getItem("publicacionId")
        
        // Crear un objeto con los datos de la publicación
        const publicacionEditada = {
            nombre,
            descripcion,
            imagenes,
            estado,
            id
        };

        // Enviar la solicitud al servidor
        fetch('http://localhost:3000/editarPublicacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(publicacionEditada)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Publicación editada con éxito');
                alert('Publicación editada con éxito');
            } else {
                console.error('Error:', data.message);
                alert('Error al editar la publicación: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            alert('Error en la solicitud: ' + error);
        });
    }

    // Evento al hacer clic en el botón de guardar cambios
    document.getElementById('editarPublicacionButton').addEventListener('click', editarPublicacion);
});
