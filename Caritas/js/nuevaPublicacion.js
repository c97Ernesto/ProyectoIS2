document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formularioPublicacion");

  formulario
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const nombrePublicacion =
        document.getElementById("nombrePublicacion").value;
      const urlImagen = document.getElementById("urlImagen").value;
      const descripcion = document.getElementById("descripcion").value;
      const estado = document.getElementById("estado").value;
      const categoria = document.getElementById("categoria").value;

      //obtener correo del usuario (localhost)
      const correoUsuario = "laloConstante@gmail.com";

      // Enviar los datos al backend usando fetch
      fetch("/publicacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombrePublicacion,
          urlImagen,
          descripcion,
          estado,
          categoria,
          correoUsuario,
        }),
      }).then((response) => {
        if (response.ok) {
          window.location.href = "./misPublicaciones.html";
        } else {
          // La solicitud no fue exitosa, puedes manejar el error aquí
          alert("Error al publicar");
        }
      });
    })
    .catch((error) => {
      console.error("Error al enviar la solicitud:", error);
    });
});
