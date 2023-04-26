const socket = io.connect()

// PRODUCTOS

// NO SE ESTA USANDO
const agregarEventosBotones = () =>{
    
    const addToCardButtons = document.getElementsByClassName('btn-compra')
    
    for (let i = 0; i < addToCardButtons.length; i++) {
        const btn = addToCardButtons[i]
        const identifier = btn.dataset.target;
        console.log(identifier)
        btn.addEventListener('click', () => addToCart(identifier))
    }
    
    const addToCart = (id) => {
        // agregar acá la función de agregar al carrito
      console.log(id);
      
    }

    const deleteButtons = document.getElementsByClassName('btn-delete')
    
    for (let i = 0; i < deleteButtons.length; i++) {
        const btn = deleteButtons[i]
        const identifier = btn.dataset.target;
        console.log(identifier)
        btn.addEventListener('click', () => addToCart(identifier))
    }
}


// MENSAJES

const activarFormulario = () =>{

    const inputEmail = document.getElementById('inputEmail')
    const inputMensaje = document.getElementById('inputMensaje')
    const btnEnviar = document.getElementById('btnEnviar')

    inputEmail.addEventListener('input', () => {
        const hayEmail = inputEmail.value.length
        const hayTexto = inputMensaje.value.length
        inputMensaje.disabled = !hayEmail
        btnEnviar.disabled = !hayEmail || !hayTexto
    })
    
    inputMensaje.addEventListener('input', () => {
        const hayTexto = inputMensaje.value.length
        btnEnviar.disabled = !hayTexto
    })

    const formPublicarMensaje = document.getElementById('formPublicarMensaje')
    formPublicarMensaje.addEventListener('submit', e => {
        e.preventDefault()
        const mensaje= {
            "email":inputEmail.value,
            "mensaje":inputMensaje.value
        }
        socket.emit('nuevoMensaje', mensaje)
        formPublicarMensaje.reset()
        inputMensaje.focus()
    })
}

socket.on('mensajes', mensajes => {
    const html = makeHtmlList(mensajes)
    document.getElementById('mensajes') && (document.getElementById('mensajes').innerHTML = html);
})

function makeHtmlList(mensajes) {
    let html = mensajes.map((mje) =>{
        return (`
        <p>
        <strong class="email">${mje.email}</strong> [<span class="fecha">${mje.fecha}</span>]: <em class="mensaje">${mje.mensaje}</em>
        </p>`)
    }).join('')
    return html
}


document.addEventListener('DOMContentLoaded', 
    agregarEventosBotones)
document.addEventListener('DOMContentLoaded', () =>{
    document.getElementById('formPublicarMensaje') &&  activarFormulario
})
