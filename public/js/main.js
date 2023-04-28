const socket = io.connect()

// PRODUCTOS

const agregarEventosBotones = () =>{
    
    // const addToCardButtons = document.getElementsByClassName('btn-compra')
    
    // for (let i = 0; i < addToCardButtons.length; i++) {
    //     const btn = addToCardButtons[i]
    //     const identifier = btn.dataset.target;
    //     console.log(identifier)
    //     btn.addEventListener('click', () => addToCart(identifier))
    // }
    
    // const addToCart = (id) => {
    //     // agregar acá la función de agregar al carrito
    //   console.log(id);
      
    // }

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
                errorModificacion.innerHTML = `Error de modificacion + err`
                form.appendChild(errorModificacion)
            });
        });
    }

    // const editButtons = document.getElementsByClassName('btn-editar')
    // for (let i = 0; i < editButtons.length; i++) {
    //     const btn = editButtons[i]
    //     const idProducto = editButtons[i].id
    //     let producto = {
    //         ...req.body,
    //         thumbnail: thumbnail,
    //         timestamp: timestamp
    //     }
    //     btn.addEventListener('click', () =>{
    //         axios.put(`../../../api/productos/producto/${idProducto}`,
    //         {
    //             "nombre": name,
    //             "descripcion": "Gran vino para regalar",
    //             "codigo": "4234119",
    //             "precio": "9900",
    //             "stock": "50",
    //             "thumbnail": "/upload/item1.jpeg"
    //         })
    //         .then(res => (btn.innerHTML= 'Producto Modficado'))
    //         .catch(error =>{
    //             btn.parentElement.innerHTML = 'Se produjo un error. Quizás no tenga los permisos necesarios para esta acción'
    //         })
    //     })
    // }

    // for (let i = 0; i < deleteButtons.length; i++) {
    //     const btn = deleteButtons[i]
    //     const identifier = btn.dataset.target;
    //     console.log(identifier)
    //     btn.addEventListener('click', () => addToCart(identifier))
    // }
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
