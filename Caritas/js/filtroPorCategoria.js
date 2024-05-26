document.addEventListener('DOMContentLoaded', () => {
    const botonesCategorias = document.querySelectorAll('.categoria');

    botonesCategorias.forEach(boton => {
        boton.addEventListener('click', () => {
            const categoria = boton.id;
            window.location.href = `misPublicaciones.html?categoria=${categoria}`;
        });
    });
});


