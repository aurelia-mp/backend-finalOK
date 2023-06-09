import {
    productosDao as productosApi,
    carritosDao as carritosApi
} from '../daos/index.js'
import { enviarEmailPedido } from '../../scripts/mailer.js'
import enviarWA from '../../scripts/twilio.js';
import { usuarioActual } from '../routers/routerAuth.js';
import { logInfo, logWarn } from '../../scripts/loggers/loggers.js'

let carritoEnCurso

const crearCarrito = (req,res) =>{
    // crear  un carrito vacío y devuelve  el id
     // Redirige a la página con los productos
    let timestamp = Date.now()
    let nuevoCarrito = {
        items: [],
        cart_timestamp: timestamp
    } 
    carritosApi.save(nuevoCarrito)
    .then((id) => 
        {
            carritoEnCurso = id
            res.redirect(303, '/api/productos')
        })
}

const borrarCarrito = (req,res) =>{
    let id = req.params.id
    carritosApi.deleteById(id)
    .then(resp =>{
        carritoEnCurso = null
        res.redirect(303, '/api/productos')
    })
}

const getCarrito = (req,res) => {
    //  Lista los productos del carrito
    let id= req.params.id
    carritosApi.getById(id)
    .then((carrito) => {
        let prods = carrito["items"]
        res.render('carrito', {idCarrito: id, items: prods})
                })
    .catch((err) =>{
        logWarn(err)
        res.send("El carrito requerido no existe" + err)
    })
}

const agregarItemAlCarrito  = (req,res)  =>{
    // Carga un producto a un carrito con el id de producto
    let id = req.params.id
    let id_prod =req.params.id_prod
    // parsea el id producto solo si es un numero-  lo deja igual si es un string
    let id_prod_parseado = parseInt(id_prod)
    if (`"${id_prod_parseado}"`=== id_prod){
        id_prod = id_prod_parseado
    }    
    
    productosApi.getById(id_prod)

    .then((productoNuevo)=>{
        logInfo(`{productoNuevo} agregado al carrito`)
        carritosApi.getById(id)
        .then((carritoAActualizar) =>{
            let carrito = JSON.stringify(carritoAActualizar)
            let prods  = JSON.parse(carrito)["items"]
            prods.push(productoNuevo)
            let cart_timestamp = Date.now()
            carritosApi.udpateById(id, {"items": prods, cart_timestamp})
            .then((carrito) =>{
                    res.render('carrito', {idCarrito: id, items: carrito.items})
                })
            })
            .catch((err) =>{
                logWarn(err)
                res.send("Error al actualizar el carrito" + err)
            })
        })
        .catch((err) =>{
            logWarn(err)
            res.send("Error al actualizar el carrito" + err)
        })
    }


const agregarVariosItemsAlCarrito  = (req, res) =>{
    // Carga un nuevo array de productos a un carrito
    let prods = req.body
    let id = req.params.id
    let cart_timestamp = Date.now()
    carritosApi.udpateById(id, {"items": prods, cart_timestamp})
    .then((respuesta) =>{
        console.log(respuesta)
        if(respuesta === null){
            res.send(`No se encontró ningún carrito con el id ${id}`)

        }
        else{
            res.send(`Productos agregados al carrito ${id}`)
        }
    })
}

const borrarItemDelCarrito = (req,res) =>{
    let id = req.params.id
    let id_prod = req.params.id_prod
    // parsea el id producto solo si es un numero-  lo deja igual si es un string
    isNaN(id_prod) ? id_prod : (id_prod = parseInt(id_prod))
    carritosApi.getById(id)
    .then((carrito)=>{
        let prods = carrito["items"]
        let index = prods.findIndex((el) => el._id == id_prod)
        if (index === -1){
            res.send('Error: Este producto no se encuentra en el carrito')
            return
        }
        prods.splice(index,1)
        let cart_timestamp = Date.now()
        carritosApi.udpateById(id, {"items": prods, cart_timestamp})
        res.send("Producto eliminado")
    })
    .catch(err => {
        logWarn(err)
        res.send(`Error: el carrito no existe - ${err}`)
    }) 
}

const enviarConfirmacion = async (req, res) =>{
    let id = req.params.id
    let numero
    usuarioActual && (numero = usuarioActual.tel)
    console.log('usuario actual'+ usuarioActual)

    // Envío de mail
    let carrito = await carritosApi.getById(id)
    carrito = JSON.stringify(carrito)
    let items = JSON.parse(carrito)["items"]
    enviarEmailPedido(id,items,usuarioActual)

    // Envío de WA
    enviarWA(numero)
    res.send("Confirmaciones enviadas")
}
       
    
export {
    carritoEnCurso,
    crearCarrito,
    borrarCarrito,
    getCarrito,
    agregarVariosItemsAlCarrito,
    agregarItemAlCarrito,
    borrarItemDelCarrito,
    enviarConfirmacion

}