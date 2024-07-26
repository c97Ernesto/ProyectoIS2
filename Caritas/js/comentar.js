document.addEventListener('DOMContentLoaded', () => {
    const email = localStorage.getItem('token');
    const publicacionId = localStorage.getItem('publicacionId');

    if (!email || !publicacionId) {
        console.error('Token o ID de publicación no encontrado');
        return;
    }
    const newCommentInput = document.getElementById('new-comment');
    const postCommentButton = document.getElementById('post-comment');

    postCommentButton.addEventListener('click', () => {
        const commentText = newCommentInput.value.trim();
        if (commentText === '') {
            alert('Por favor, escribe un comentario.');
            return;
        }
        
        fetch('http://localhost:3000/guardarComentario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${email}` // Asegura que el token esté bien formateado
            },
            body: JSON.stringify({
                publicacionId: publicacionId,
                comentario: commentText,
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Comentario publicado exitosamente.');
                window.location.href = `http://localhost:3000/verDetallePublicacion.html`;
            } else {
                alert('Error al publicar el comentario.');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            alert('Error al publicar el comentario.');
        });
    });
});