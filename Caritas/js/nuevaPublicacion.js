
document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formularioPublicacion");

  formulario.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    const nombrePublicacion =
      document.getElementById("nombrePublicacion").value;
    const urlImagen = document.getElementById("urlImagen").value;
    const descripcion = document.getElementById("descripcion").value;
    const estado = document.getElementById("estado").value;
    const categoria = document.getElementById("categoria").value;

    // Obtener correo del usuario (localhost)
    //const correoUsuario = "laloConstante@gmail.com";

    const token = localStorage.getItem('token');

    // Enviar los datos al backend usando fetch
    fetch("/publicacion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        nombrePublicacion,
        urlImagen,
        descripcion,
        estado,
        categoria,
      }),
    })
    .then((response) => {
      if (response.ok) {
        alert("Publicación cargada con éxito");
        setTimeout(() => {
          window.location.href = "./misPublicaciones";
        }, 300);
      } else {
        alert("Debe iniciar sesión para cargar una publicación");
        setTimeout(() => {
          window.location.href = "./login.html";
        }, 300);
        throw new Error("Error al publicar");
      }    
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
        alert(error.message); // Muestra el mensaje de error en una alerta
      });
  });
});
