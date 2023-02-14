const tipoDeDepositoElegido = ''
const anchoDeposito = 300
const altoDeposito = 300
const profundidadDeposito = 300
let volumenMaximo = anchoDeposito * altoDeposito * profundidadDeposito
let precioPorCm3 = 0.01
let volumenOcupado = 0
let nuevoVolumen = 0
let hayEspacio = false

let costoTotal = 0

const espacioOcupado = document.querySelector('#espacioOcupado')
const espacioMaximo = document.querySelector('#espacioMaximo')
espacioMaximo.innerText = volumenMaximo

const generadorDeObjetos = document.querySelector('#generadorDeObjetos')
const nuevoObjeto = document.querySelector('#nuevoObjeto')
const ancho = document.querySelector('#ancho')
const alto = document.querySelector('#alto')
const profundidad = document.querySelector('#profundidad')

let listaDeObjetosGenerados = []

const mensajeDeErrorForm = document.querySelector('#mensajeDeErrorForm')

const tipoDeDeposito = document.querySelector('#tipoDeDeposito')
const precioTotal = document.querySelector('#precioTotal')
const botonRepetir = document.querySelector('#botonRepetir')
const botonContratar = document.querySelector('#botonContratar')


nuevoObjeto.addEventListener('input', (e) => {
    
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

    return nuevoVolumen = ancho.value * alto.value * profundidad.value

})

const validarMedidas = () => {

    if(mensajeDeErrorForm.innerHTML.length > 0){
        mensajeDeErrorForm.innerHTML = ""
    }

    if(ancho.value > anchoDeposito || alto.value > altoDeposito || profundidad.value > profundidadDeposito){

        let errorDetectado = ''

        if (ancho.value > anchoDeposito){
            errorDetectado = 'El ancho excede los límites del depósito'
        }else if (alto.value > altoDeposito){
            errorDetectado = 'La altura excede los límites del depósito'  
        }else if (profundidad.value > profundidadDeposito){
            errorDetectado = 'La profundidad excede los límites del depósito'
        }

        mensajeDeErrorForm.innerHTML = '<div class="alert alert-danger p-2 small">' + errorDetectado + '</div>'
    }

    return nuevoVolumen = ancho.value * alto.value * profundidad.value
}

const validarEspacioDisponible = () => {

    if(volumenMaximo - volumenOcupado >= nuevoVolumen){
        return hayEspacio = true
    }else{
        return hayEspacio = false
    }
}

const validarDepositoDisponible = () => {
    if(volumenMaximo < volumenOcupado){
        botonContratar.disabled = true
        alert('En este depósito no entran todos tus objetos, probá con un depósito más grande o eliminá algunos objetos')
    }else{
        botonContratar.disabled = false
    }
}

const agregarObjeto = () => {

    const contenedorDeLista = document.querySelector('#contenedorDeLista')
    const nombreObjeto = nuevoObjeto.value
    const anchoObjeto = ancho.value
    const altoObjeto = alto.value
    const profundidadObjeto = alto.value

    const generarObjeto = (nombreObjeto, anchoObjeto, altoObjeto, profundidadObjeto) => {
        return {nombre: nombreObjeto, anchoObjeto, altoObjeto, profundidadObjeto}
    }

    const objeto = generarObjeto(nombreObjeto, anchoObjeto, altoObjeto, profundidadObjeto)
    listaDeObjetosGenerados.push(objeto)
    nuevoVolumen = anchoObjeto * altoObjeto * profundidadObjeto

    actualizarLista(listaDeObjetosGenerados)
    
}

const sumarVolumenOcupado = () =>{
    volumenOcupado = volumenOcupado + nuevoVolumen
    espacioOcupado.innerText = `${volumenOcupado}`
}

const actualizarLista = (listaDeObjetosGenerados) => {
    contenedorDeLista.innerHTML = ''
    
    listaDeObjetosGenerados.forEach((objeto) => {
        const div = document.createElement('div')
        div.innerHTML = `<div class="d-flex justify-content-between rounded-2 mb-3">
                            <div id="nombreDeObjeto" value="${objeto.nombre}">${objeto.nombre}</div>
                            <div class="d-flex align-items-center gap-1" id="volumenDeObjeto"> ${objeto.nombre} <span>cm3</span><button type="button" class="btn-close small" aria-label="Close"></button></div>
                        </div>`
        nuevoVolumen = objeto.anchoObjeto * objeto.altoObjeto * objeto.profundidadObjeto
        contenedorDeLista.appendChild(div)
        validarEspacioDisponible()
        sumarVolumenOcupado()
    })
    
}

const calcularTotal = () =>{
    costoTotal = volumenOcupado * precioPorCm3
    precioTotal.innerText = parseInt(costoTotal)
}

generadorDeObjetos.addEventListener('submit', (e) => {
    e.preventDefault()
    validarMedidas()
    validarEspacioDisponible()
    if(hayEspacio){
        agregarObjeto()
    }else{
        alert('No hay espacio disponible para este objeto')
    }
    calcularTotal()
    // generadorDeObjetos.reset()
})

tipoDeDeposito.addEventListener('input', (e) => {

    const depositoElegido = tiposDeDepositos.find(deposito => deposito.id == tipoDeDeposito.value)
    volumenMaximo = depositoElegido.ancho * depositoElegido.alto * depositoElegido.profundidad
    precioPorCm3 = depositoElegido.precio

    espacioMaximo.innerText = volumenMaximo

    validarDepositoDisponible()
    calcularTotal()
})

const guardarEnLocalStorage = () =>{

    const misObjetos = JSON.stringify(listaDeObjetosGenerados)

    if (document.getElementById('storageCheck').checked && listaDeObjetosGenerados.length != 0){
        localStorage.setItem('listaAnterior', misObjetos)
    }
}

listaDeObjetos.addEventListener('submit', (e) =>{
    e.preventDefault
})

botonContratar.addEventListener('click', (e) =>{
    guardarEnLocalStorage()
})

const traerDeLocalStorage = () =>{

    let misObjetos = JSON.parse(localStorage.getItem('listaAnterior'))
    listaDeObjetosGenerados.splice(0, listaDeObjetosGenerados.length)
    listaDeObjetosGenerados = misObjetos

    actualizarLista(listaDeObjetosGenerados)
}

botonRepetir.addEventListener('click', (e) =>{
    traerDeLocalStorage()
})