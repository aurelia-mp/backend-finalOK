import {
    productosDao as productosApi,
} from '../daos/index.js'

import { logInfo, logError, logWarn } from '../../scripts/loggers/loggers.js'
import { carritoEnCurso } from './controllersCarrito.js'
import ProductoDTO from '../clases/ProductoDTO.js'
import Cotizador from '../clases/Cotizador.js'
import { usuarioActual } from '../routers/routerAuth.js'

let idCarrito
const cotizador = new Cotizador()

export const getProductos = (req,res) =>{
    productosApi.getAll()
    .then(productos=>{
        carritoEnCurso && (idCarrito = carritoEnCurso)
        res.render('products', {productos: productos, idCarrito: idCarrito || null, usuarioActual: usuarioActual })
    })
    .catch(err=>{
        logError(err)
        res.send(err)
    })
}

export const listarPreciosUSD = (req, res) =>{
    productosApi.getAll()
    .then((productos) =>{
        const productosUSD = productos.map((prod) => {
            const cotizaciones = {
                precioDolar: cotizador.getPrecioSegunMoneda(prod.precio, 'USD'),
                precioARS: cotizador.getPrecioSegunMoneda(prod.precio, 'ARS'),
            }

            return new ProductoDTO(prod, cotizaciones);

        })
        res.render('preciosUSD', {productos: productosUSD})
    })
    .catch(err=>{
        logError(err)
        res.send(err)
    })

}

export const getProductoById = (req,res) =>{
        let id = req.params.id
        productosApi.getById(id)
        .then(producto => 
            producto ? 
                res.render('editar', {producto: producto})
                // res.send(resp)
                :
                res.send({error: 'producto no encontrado'}) 
            )
}

export const borrarProductoById = (req,res) =>{
    let id=req.params.id
    productosApi.deleteById(id)
    .then(resp=>
            resp ?
                (res.send(`Producto ${id} borrado`))
                :
                res.send({error: 'producto no encontrado'}) 
        )
}

export const modificarProductoById = (req,res) =>{
    let id = req.params.id
    let timestamp= Date.now()

    let cambios = {
        ...req.body,
        timestamp:timestamp
    }

    logInfo(cambios)

    productosApi.udpateById(id, cambios)

    .then((respuesta)=>{
        res.send(`Producto ${id} actualizado` + respuesta)
    })
}

export const crearProducto = (req,res,next) =>{
    const file = req.file
    let thumbnail

    if(!file) {
        const error = new Error('Error subiendo el archivo')
        logError(error)
        error.httpStatusCode = 400
        // se comenta el return para poder guardar registros via postman, sin subir la imagen
        // return next(error)
        logWarn('Error al subir el archivo, producto guardado sin imagen' + error)
        thumbnail = "none"
    }
    
    const timestamp = Date.now()

    // Se agrega esta línea para evitar errores si no se posteó una imagen
    thumbnail !== "none" && (thumbnail = `/upload/${file.originalname}`)

    let producto = {
        ...req.body,
        thumbnail: thumbnail,
        timestamp: timestamp
    }

    if(!req.body.nombre || !req.body.precio) {
        const error = new Error('Faltan campos obligarios')
        error.httpStatusCode = 400
        logWarn(error)
        return next(error)
    }
    productosApi.save(producto)

    .then(() =>{
        logInfo('Producto guardado')
        productosApi.getAll()
        .then((listaProductos) =>{
            res.render('main', {listaProductos})
        })
    })
}

export const borrarTodos = (req, res)=>{
    productosApi.deleteAll()
    .then(()=>{
        res.send("Se borraron todos los productos")
    })
}