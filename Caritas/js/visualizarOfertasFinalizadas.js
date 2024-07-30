async function obtenerDatosDelUsuario(){
    const token = localStorage.getItem("token");

    if (!token){
        console.log("No se encontró token en localStorage");
    }
    else {
        try {
            const response = await fetch(`http://localhost:3000/usuarios/misDatos`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            });
            if (!response.ok) {
                throw new Error("Error al obtener mis datos: " +response.status +" " +response.statusText);
            }
    
            return await response.json();

        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            throw error;
        }
    }
}

async function obtenerTrueques(dni){
    const token = localStorage.getItem("token");

    if (!token){
        console.log("No se encontró token en localStorage");
    }
    else {
        const response = await fetch(`http://localhost:3000/trueques/del-usuario/${dni}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });
        if (!response.ok) {
            throw new Error("Error al obtener los trueques: " +response.status +" " +response.statusText);
        }
        return await response.json();
    }
}

async function obtenerFilial(id_filial){
    const token = localStorage.getItem("token");

    if (!token){
        console.log("No se encontró token en localStorage");
    }
    else {
        try {
            const response = await fetch(`http://localhost:3000/filial/detalles/${id_filial}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            });
            if (!response.ok) {
                throw new Error("Error al obtener la filial: " +response.status +" " +response.statusText);
            }
            return await response.json();    
        } catch (error) {
            console.error("Error al obtener los detalles de la filial:", error);
            return null; 
        }
    }
}

function mostrarTrueques(trueques){
    const listaTrueques = document.getElementById('lista-trueques');
    listaTrueques.innerHTML = '';

    trueques.forEach(async trueque => {

        const filial = await obtenerFilial(trueque.id_filial);

        console.log(filial)

        const ul = document.createElement('ul');
        ul.classList.add('list-group');

        if  (filial && filial.length > 0){
            ul.innerHTML = `
                <li class="list-group-item">
                    <div class="container text-center">
                        <div class="row ">
                            
                        </div>
                        <div class="container text-start">
                            <div class="row">
                                <div class="col ">
                                    <p class="mb-1">Filial: <strong>${filial[0].nombre}</strong></h5>
                                    <p class="mb-1">Fecha: <strong>${new Date(trueque.fecha_intercambio).toLocaleString()}</strong></p>
                                    <p class="mb-1">Estado: <strong>${trueque.estado}</strong></p>
                                </div>
                                <div class="col">
                                    <p class="mb-1">Nombre ofertante: ${trueque.nombre_ofertante}</p>
                                    <p class="mb-1">Dni ofertante: ${trueque.dni_ofertante}</p>
                                    <p class="mb-1">Producto: ${trueque.id_producto_ofertante}</p>
                                </div>
                                <div class="col">
                                    <p class="mb-1">Nombre receptor: ${trueque.nombre_receptor}</p>
                                    <p class="mb-1">Dni receptor: ${trueque.dni_receptor}</p>
                                    <p class="mb-1">Producto: ${trueque.id_producto_receptor}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            `;
        }
        else {
            ul.innerHTML = `
                <li class="list-group-item">
                    <div class="container text-center">
                        <div class="row ">
                        <div class="col ">
                            <p class="mb-1">Filial: ${trueque.id_filial}</p>
                        </div>
                        <div class="col ">
                            <p class="mb-1">Dni receptor: ${trueque.dni_receptor}</p>
                        </div>
                    </div>
                    <div class="container text-start">
                        <div class="row">
                            <div class="col align-self-center">
                                <p class="mb-1">Estado: ${trueque.estado}</p>
                            </div>
                            <div class="col">
                                <p class="mb-1">Nombre ofertante: ${trueque.nombre_ofertante}</p>
                                <p class="mb-1">Dni ofertante: ${trueque.dni_ofertante}</p>
                                <p class="mb-1">Producto: ${trueque.id_producto_ofertante}</p>
                            </div>  
                            <div class="col">
                                <p class="mb-1">Nombre receptor: ${trueque.nombre_receptor}</p>
                                <p class="mb-1">Dni receptor: ${trueque.dni_receptor}</p>
                                <p class="mb-1">Producto: ${trueque.id_producto_receptor}</p>
                            </div>
                        </div>
                    </div>                
                </li>
            `;
        }

        listaTrueques.appendChild(ul);
    });
}

document.addEventListener('DOMContentLoaded', async () => {

    const datos = await obtenerDatosDelUsuario();

    if (datos){
        const ofertasFinalizadas = await obtenerTrueques(datos[0].DNI);   
        console.log(ofertasFinalizadas);

        if (ofertasFinalizadas.length === 0){
            alert("No se encontraron ofertas finalizadas");
            console.log('No se enconetraron ofertas finalizadas');
            const listaTrueques = document.getElementById('lista-trueques');
            listaTrueques.innerHTML = '';
            const div = document.createElement('div');
            div.innerHTML = `<h5 class="text-center">No se encontraron ofertas finalizadas</h5>`;
            listaTrueques.appendChild(div)

        }
        else {
            console.log(ofertasFinalizadas);
            mostrarTrueques(ofertasFinalizadas);
        }
    }
})