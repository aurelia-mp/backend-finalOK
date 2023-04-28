import express from 'express'
import upload from '../multer.js'

import {
    getProductos,
    getProductoById,
    modificarProductoById,
    crearProducto,
    borrarProductoById,
    borrarTodos,
    listarPreciosUSD
} from '../controllers/controllersProductos.js'

const routerProductos = express.Router()


//  Middleware - Acceso solo para Administradores   

const enviarErrorAuth = (url, metodo)  =>{
    const error ={
        error: -1
    }
    if(url && metodo){
        error.descripcion = `No tiene las credenciales para acceder a la ruta ${url} con el método ${metodo}`
    }
    else{
        error.descripcion = "No autorizado"
    }
    return error
}

const soloAdmins = (req, res, next) =>{
    const esAdmin = req.session.passport.user.admin
    if (!esAdmin){
        res.json((enviarErrorAuth(req.url, req.method)))
    }
    else{
        next()
    }
}


routerProductos.use((express.json()))

// Rutas
routerProductos.get('', getProductos)
routerProductos.get('/preciosUSD', listarPreciosUSD)
routerProductos.get('/producto/:id', getProductoById)
routerProductos.post('', soloAdmins, upload.single('file'), crearProducto)
routerProductos.put('/producto/:id', soloAdmins, modificarProductoById)
routerProductos.delete('/producto/:id', soloAdmins, borrarProductoById)
routerProductos.delete('', borrarTodos)

export default routerProductos