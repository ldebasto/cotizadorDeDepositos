//formulario de objetos agregados

const calculadorDeObjetos = document.querySelector('#calculadorDeObjetos')

//formulario de ingreso de objetos

const generadorDeObjetos = document.querySelector('#generadorDeObjetos')
const nuevoObjeto = document.querySelector('#nuevoObjeto')
const ancho = document.querySelector('#ancho')
const alto = document.querySelector('#alto')
const profundidad = document.querySelector('#profundidad')

let nuevoVolumen = 0
let volumenOcupado = 0

//Recoleccion de datos del nuevo objeto

nuevoObjeto.addEventListener('input', (e) => {

    fetch('/objetosPredefinidos.json')
        .then(response => response.json())
        .then(objetosPredefinidos => {
    
            const objetoPredefinido = objetosPredefinidos.find(objeto => objeto.nombre === e.target.value)
            
            if(objetoPredefinido){
                ancho.value = objetoPredefinido.ancho
                alto.value = objetoPredefinido.alto
                profundidad.value = objetoPredefinido.profundidad
                ancho.disabled = true
                alto.disabled = true
                profundidad.disabled = true
            }else{
                ancho.disabled = false
                alto.disabled = false
                profundidad.disabled = false
            }
        })
        .catch(error => {
          console.error('Hubo un error al importar el archivo JSON:', error);
        });

})

//Inicializacion y eleccion de deposito

const tipoDeDeposito = document.querySelector('#tipoDeDeposito')
const espacioMaximo = document.querySelector('#espacioMaximo')


let tipoDeDepositoElegido = tiposDeDepositos.find(deposito => deposito.id == tipoDeDeposito.value)
let anchoDeposito = tipoDeDepositoElegido.ancho
let altoDeposito = tipoDeDepositoElegido.alto
let profundidadDeposito = tipoDeDepositoElegido.profundidad
let precioPorCm3 = tipoDeDepositoElegido.precio

let volumenMaximo = anchoDeposito * altoDeposito * profundidadDeposito

espacioMaximo.innerHTML = volumenMaximo


tipoDeDeposito.addEventListener('input', (e) => {
    tipoDeDepositoElegido = tiposDeDepositos.find(deposito => deposito.id == tipoDeDeposito.value)
    anchoDeposito = tipoDeDepositoElegido.ancho
    altoDeposito = tipoDeDepositoElegido.alto
    profundidadDeposito = tipoDeDepositoElegido.profundidad
    precioPorCm3 = tipoDeDepositoElegido.precio

    volumenMaximo = anchoDeposito * altoDeposito * profundidadDeposito
    espacioMaximo.innerHTML = volumenMaximo

    validarDepositoDisponible()
    calcularTotal()

})

//Validacion de medidas en base al tamaño del deposito y mensajes de error

let medidasValidas = false

const validarMedidas = () => {

    if(ancho.value > anchoDeposito || alto.value > altoDeposito || profundidad.value > profundidadDeposito){
        const mensajeDeErrorForm = document.querySelector('#mensajeDeErrorForm')

        let errorDetectado = ''

        if (ancho.value > anchoDeposito){
            errorDetectado = 'El ancho excede los límites del depósito'
        }else if (alto.value > altoDeposito){
            errorDetectado = 'La altura excede los límites del depósito'  
        }else if (profundidad.value > profundidadDeposito){
            errorDetectado = 'La profundidad excede los límites del depósito'
        }

        mensajeDeErrorForm.innerHTML = '<div class="alert alert-danger p-2 small">' + errorDetectado + '</div>'
        return medidasValidas = false
    }else{
        mensajeDeErrorForm.innerHTML = ""
        return medidasValidas = true
    }
}


// Validacion de espacio suficiente segun el deposito y los objetos en el

let hayEspacio = false

const validarEspacioDisponible = () => {

    nuevoVolumen = ancho.value * alto.value * profundidad.value

    if(volumenMaximo - volumenOcupado >= nuevoVolumen){
        return hayEspacio = true
    }else{
        return hayEspacio = false
    }
}

//Almacenar objetos en array

let listaDeObjetos = []

const agregarAlArray = () =>{

    const nombreObjeto = nuevoObjeto.value
    const anchoObjeto = ancho.value
    const altoObjeto = alto.value
    const profundidadObjeto = profundidad.value

    const generarObjeto = (nombreObjeto, anchoObjeto, altoObjeto, profundidadObjeto) => {
        return {nombre: nombreObjeto,
                ancho: anchoObjeto,
                alto: altoObjeto,
                profundidad: profundidadObjeto,
                id: Date.now()
            }
    }

    const objeto = generarObjeto(nombreObjeto, anchoObjeto, altoObjeto, profundidadObjeto)

    listaDeObjetos.push(objeto)

}

//Actualizar objetos en el DOM

const contenedorDeLista = document.querySelector('#contenedorDeLista')

const actualizarArrayEnDOM = (listaDeObjetos, nuevoVolumen) => {
    contenedorDeLista.innerHTML = ''
    volumenOcupado = 0
    espacioOcupado.innerHTML = 0
    
    listaDeObjetos.forEach((objeto) => {

        nuevoVolumen = objeto.ancho * objeto.alto * objeto.profundidad

        const div = document.createElement('div')
        div.innerHTML = `<div class="d-flex justify-content-between rounded-2 mb-3">
                            <div id="nombreDeObjeto" >${objeto.nombre}</div>
                            <div class="d-flex align-items-center gap-1"> ${nuevoVolumen} <span>cm3</span><button type="button" class="btn-close small" aria-label="Close" value="${objeto.id}"></button></div>
                        </div>`

        contenedorDeLista.appendChild(div)
        volumenOcupado = volumenOcupado + nuevoVolumen
        espacioOcupado.innerHTML = volumenOcupado
    })
}

//Calcular volumen total


//Eliminar objeto en particular
 
const eliminarObjeto = (objetoAEliminar) =>{

    const objetoClickeado = listaDeObjetos.find(objeto => objeto.id == objetoAEliminar )
    const posicionDelObjeto = listaDeObjetos.indexOf(objetoClickeado)

    if(posicionDelObjeto != -1){
        listaDeObjetos.splice(posicionDelObjeto, 1)
    }
    
    actualizarArrayEnDOM(listaDeObjetos)

}

contenedorDeLista.addEventListener('click', (e) =>{
    e.preventDefault()
    eliminarObjeto(e.target.value)
    validarDepositoDisponible()
    calcularTotal()
})

// Calcular total a pagar mensual

let costoTotal = 0

const calcularTotal = () =>{
    costoTotal = volumenOcupado * precioPorCm3
    precioTotal.innerText = parseInt(costoTotal)
}

generadorDeObjetos.addEventListener('submit', (e) => {
    e.preventDefault()
    validarMedidas()
    if(medidasValidas){
        validarEspacioDisponible()
        if(hayEspacio){
            agregarAlArray()
            actualizarArrayEnDOM(listaDeObjetos)
            generadorDeObjetos.reset()
        }else{
            Swal.fire({
                title: 'No hay espacio suficiente',
                text: 'Probá con otro tipo de depósito o eliminá algunos objetos',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              })
        }
    }
    calcularTotal()
})

// Parte 2

//Guardar en local storage

const guardarEnLocalStorage = () =>{

    const ultimosObjetos = JSON.stringify(listaDeObjetos)
    localStorage.setItem('listaAnterior', ultimosObjetos)   
}

const botonContratar = document.querySelector('#botonContratar')

// Validacion de deposito contra objetos ya cargados

const validarDepositoDisponible = () => {
    if(volumenMaximo < volumenOcupado){
        botonContratar.disabled = true
        Swal.fire({
            title: 'No hay espacio suficiente',
            text: 'Probá con otro tipo de depósito o eliminá algunos objetos',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
    }else{
        botonContratar.disabled = false
    }
}


    

// repetir alquiler anterior

const traerDeLocalStorage = () =>{

    let misObjetosAnteriores = JSON.parse(localStorage.getItem('listaAnterior'))

    if(misObjetosAnteriores){
        listaDeObjetos.splice(0, listaDeObjetos.length)
        listaDeObjetos = misObjetosAnteriores
        actualizarArrayEnDOM(listaDeObjetos)
        calcularTotal()
    }else{
        Swal.fire({
            position: 'center',
            text: 'No hay depósitos guardados',
            showConfirmButton: false,
            timer: 1000
          })
    }
}

botonRepetir.addEventListener('click', (e) =>{
    traerDeLocalStorage()
})

calculadorDeObjetos.addEventListener('submit', (e) =>{

    e.preventDefault()
    
    if (document.getElementById('storageCheck').checked && listaDeObjetos.length != 0){
        guardarEnLocalStorage()
    }
    
    if(costoTotal > 0){
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
            confirmButton: 'btn btn-primary text-white',
            cancelButton: 'btn btn-secondary'
            },
            buttonsStyling: false
        })
        
        swalWithBootstrapButtons.fire({
            title: 'Confirmar alquiler',
            text: `¿Estás seguro de alquilar este espacio por $${costoTotal} ARS mensuales?`,
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
            swalWithBootstrapButtons.fire(
                '¡Confirmado!',
                'Nos contactaremos para recoger tus objetos',
                'success'
            )
                listaDeObjetos = []
                actualizarArrayEnDOM(listaDeObjetos)
            } else if (result.dismiss === Swal.DismissReason.cancel && document.getElementById('storageCheck').checked == false) {
                swalWithBootstrapButtons.fire({
                    title: 'Guardar objetos',
                    text: `¿Querés guardar tus objetos por si cambiás de opinión?`,
                    showCancelButton: true,
                    confirmButtonText: 'Guardar',
                    cancelButtonText: 'No, gracias',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                    guardarEnLocalStorage()
                    swalWithBootstrapButtons.fire(
                        '¡Te esperamos pronto!',
                        'Recordaremos tus objetos cuando vuelvas',
                        'success'
                    )}
                })
            }
        })
    }

})