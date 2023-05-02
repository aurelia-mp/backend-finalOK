const socket = io.connect()

//----------------- PRODUCTOS ----------------------//
const agregarEventosBotones = () =>{
    // AXIOS - DELETE PRODUCTOS
    const deleteButtons = document.getElementsByClassName('btn-delete')
    if(deleteButtons){
        for (let i = 0; i < deleteButtons.length; i++) {
            const btn = deleteButtons[i]
            const idProducto = deleteButtons[i].id
            btn.addEventListener('click', () =>{
                axios.delete(`../../../api/productos/producto/${idProducto}`)
                .then(res => (btn.innerHTML= 'Producto Borrado'))
                .catch(error =>{
                    btn.parentElement.innerHTML = 'Se produjo un error. Quizás no tenga los permisos necesarios para esta acción'
                })
            })
        }
    }

    // AXIOS - PUT PRODUCTOS
    const form = document.getElementById("formEditar");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const nombre = document.getElementById("nombre").value;
            const descripcion = document.getElementById("descripcion").value;
            const codigo = document.getElementById("codigo").value;
            const precio = document.getElementById("precio").value;
            const stock = document.getElementById('stock').value;

            // Guarda únicamente los cambios para no sobreescribir con campos vacíos
            const cambios = {}
            if (nombre != "") {cambios.nombre = nombre}
            if (descripcion != "") {cambios.descripcion = descripcion}
            if (codigo != "") {cambios.codigo = codigo}
            if (precio != "") {cambios.precio = precio}
            if (stock != "") {cambios.stock = stock}

            const idProducto = document.getElementsByClassName("btn-editar")[0].id
     
            // PUT REQUEST CON AXIOS
            axios.put(`../../../api/productos/producto/${idProducto}`, cambios)
            .then((res) => {
                const modificado = document.createElement('p')
                modificado.innerHTML = 'Producto modificado'
                form.appendChild(modificado)
            })
            .catch((err) => {
                const errorModificacion = document.createElement('p')
                errorModificacion.innerHTML = `Error de modificacion + ${err}`
                form.appendChild(errorModificacion)
            });
        });
    }

    // AXIOS - DELETE REQUEST - BORRAR PRODUCTOS DEL CARRITO
    const deleteFromCartButtons = document.getElementsByClassName('btn-eliminar')
    
    
    if(deleteFromCartButtons){
        // Obtener id del carrito
        const spanIdCarrito = document.getElementById('idCarrito')
        let idCarrito
        if(spanIdCarrito){
            idCarrito = spanIdCarrito.innerHTML
        }

        for (let i = 0; i < deleteFromCartButtons.length; i++) {
            const btn = deleteFromCartButtons[i]
            const idProducto = deleteFromCartButtons[i].id
            btn.addEventListener('click', () =>{
                axios.delete(`/api/carritos/${idCarrito}/productos/${idProducto}`)
                .then(res => (btn.innerHTML= 'Eliminado'))
                    setTimeout(() => {
                        location.href = `/api/carritos/${idCarrito}/productos`
                    }, 2000)
                .catch(error =>{
                    btn.parentElement.innerHTML = 'Se produjo un error.'
                   
                })
            })
        }
    }
    
    // AXIOS - DELETE REQUEST -BORRAR EL CARRITO
    const btnBorrarCarrito = document.getElementsByClassName('btn-eliminar-carrito')
    
    if(btnBorrarCarrito.length){
        // Obtener id del carrito
        const idCarrito = btnBorrarCarrito[0].id

        btnBorrarCarrito[0].addEventListener('click', () =>{
            axios.delete(`/api/carritos/${idCarrito}`)
            .then((res) => {
                btnBorrarCarrito[0].innerHTML= 'Carrito eliminado'
                setTimeout(() => {
                    location.href = '/'
                }, 1000)
            })
            .catch(error =>{
                btnBorrarCarrito[0].parentElement.innerHTML = 'Se produjo un error.'
               
            })
        })

        
    }
}


//----------------- MENSAJES ----------------------//

const activarFormulario = () =>{

    const formPublicarMensaje = document.getElementById('formPublicarMensaje')

    if (formPublicarMensaje){
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

// document.addEventListener('DOMContentLoaded', () =>{
//     document.getElementById('formPublicarMensaje') &&  activarFormulario
// })

document.addEventListener('DOMContentLoaded', activarFormulario)

document.addEventListener('DOMContentLoaded', 
    agregarEventosBotones)

