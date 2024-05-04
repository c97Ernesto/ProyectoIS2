function verificacionFecha(fechaNacimiento){
    const edadMinima = 18;
    const hoy = new Date();
    const diferenciaAños = hoy.getFullYear() - fechaNacimientoDate.getFullYear();

    // Comprobación de edad
    if (diferenciaAños < edadMinima || (diferenciaAños === edadMinima && hoy < new Date(fechaNacimientoDate.setFullYear(hoy.getFullYear())))) {
        alert('Debe ser mayor de 18 años para registrarse.');
        return;
    }
}
function cumpleCantidadDigitos(numero) {
    return numero.toString().length === 8;
}
function esContrasenaValida(contrasena) {
    const regex = /^(?=.[a-z])(?=.[A-Z])(?=.*\d).{8,}$/;
    return regex.test(contrasena);
}