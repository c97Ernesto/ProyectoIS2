async function obtenerUsuarios() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token no encontrado. No se puede obtener usuarios.");
        return null;
    }
    try {
        const response = await fetch("http://localhost:3000/usuarios", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        if (!response.ok) {
            throw new Error(
                "Error al obtener todos los usuarios: " +
                response.status +
                " " +
                response.statusText
            );
        }

        const usuarios = await response.json();
        mostrarUsuarios(usuarios);

    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        throw error;
    }
}

function mostrarUsuarios(usuarios){
    const usuariosBody = document.getElementById('usuarios-body');
    usuariosBody.innerHTML = '';

    usuarios.forEach(usuario => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td>${usuario.nombre}</td>
            <td>${usuario.apellido}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.rol}</td>
        `;

        usuariosBody.appendChild(fila);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    obtenerUsuarios()
    
})