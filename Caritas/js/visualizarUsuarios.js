// obtenerUsuarios.js

let usuariosData = []; // Variable para almacenar los datos originales de usuarios

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
            throw new Error("Error al obtener todos los usuarios: " + response.status + " " + response.statusText);
        }

        usuariosData = await response.json(); // Almacena los usuarios obtenidos

        mostrarUsuarios(usuariosData);
        // Deshabilitar botones de filtro si no hay usuarios
        const filterButtons = document.querySelectorAll('.btn-filter');
        if (usuariosData.length === 0) {
            filterButtons.forEach(button => {
                button.disabled = true;
            });
        } else {
            filterButtons.forEach(button => {
                button.disabled = false;
            });
        }

    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        throw error;
    }
}

function mostrarUsuarios(usuarios) {
    const usuariosBody = document.getElementById('usuarios-body');
    usuariosBody.innerHTML = '';

    usuarios.forEach(usuario => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${usuario.Correo}</td>
            <td>${usuario.rol}</td>
            <td>${usuario.Usuario}</td>
            <td>${usuario.DNI}</td>
            
            <td><button class="btn btn-primary btn-detalles" data-id="${usuario.Correo}">Detalles</button></td>
        `;
        usuariosBody.appendChild(fila);
    });

    const thCantUsuarios = document.getElementById('total-usuarios');
    thCantUsuarios.innerHTML = `Usuarios encontradas: ${usuarios.length}`;

    document.querySelectorAll('.btn-detalles').forEach(button => {
        button.addEventListener('click', event => {
            const usuarioCorreo = event.target.getAttribute('data-id');
            // Redirigir a la página de detalles del usuario
            window.location.href = `detallesUsuario.html?correo=${usuarioCorreo}`;
        });
    });
}
    

document.addEventListener('DOMContentLoaded', () => {
    obtenerUsuarios();

    const btnFilterCorreo = document.getElementById('btn-filter-correo');
    btnFilterCorreo.addEventListener('click', () => {
        const filtroCorreo = document.getElementById('input-filter-correo').value.trim().toLowerCase();
        //filtro por correo
        const usuariosFiltrados = usuariosData.filter(usuario => usuario.Correo.toLowerCase().includes(filtroCorreo));
        if (usuariosFiltrados.length == 0){
            alert("No hay usuarios que coincidan con el criterio de búsqueda ingresado.");
            obtenerUsuarios();
        }
        else {
            mostrarUsuarios(usuariosFiltrados);
        }
        document.getElementById('input-filter-correo').value = '';
    });

    const btnFilterRol = document.getElementById('btn-filter-rol');
    btnFilterRol.addEventListener('click', () => {
        const filtroRol = document.getElementById('input-filter-rol').value.trim().toLowerCase();
        //filtro por Rol
        const usuariosFiltrados = usuariosData.filter(usuario => usuario.rol.toLowerCase().includes(filtroRol));
        if (usuariosFiltrados.length == 0){
            alert("No hay usuarios que coincidan con el criterio de búsqueda ingresado.");
            obtenerUsuarios();
        }
        else {
            mostrarUsuarios(usuariosFiltrados);
        }
        document.getElementById('input-filter-rol').value = '';
    });

    const btnFilterNombreUsuario = document.getElementById('btn-filter-usuario');
    btnFilterNombreUsuario.addEventListener('click', () => {
        const filtroRol = document.getElementById('input-filter-usuario').value.trim().toLowerCase();
        //filtro por Rol
        const usuariosFiltrados = usuariosData.filter(usuario => usuario.Usuario.toLowerCase().includes(filtroRol));
        if (usuariosFiltrados.length == 0){
            alert("No hay usuarios que coincidan con el criterio de búsqueda ingresado.");
            obtenerUsuarios();
        }
        else {
            mostrarUsuarios(usuariosFiltrados);
        }
        document.getElementById('input-filter-usuario').value = '';
    });
    
    const btnFilterDNI = document.getElementById('btn-filter-dni');
    btnFilterDNI.addEventListener('click', () => {
        const filtroDNI = document.getElementById('input-filter-dni').value.trim();
        const usuariosFiltrados = usuariosData.filter(usuario => usuario.DNI.toString().includes(filtroDNI));
        if (usuariosFiltrados.length == 0){
            alert("No hay usuarios que coincidan con el criterio de búsqueda ingresado.");
            obtenerUsuarios();
        }
        else {
            mostrarUsuarios(usuariosFiltrados);
        }
        document.getElementById('input-filter-dni').value = '';
    });
    

});
