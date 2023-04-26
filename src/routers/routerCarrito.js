import express from 'express'


import { 
    getCarrito,
    borrarCarrito,
    crearCarrito,
    agregarItemAlCarrito,
    agregarVariosItemsAlCarrito,
    borrarItemDelCarrito,
    enviarConfirmacion 
} from '../controllers/controllersCarrito.js'

const routerCarrito = express.Router()


routerCarrito.post('', crearCarrito)
routerCarrito.delete('/:id', borrarCarrito)
routerCarrito.get('/:id/productos', getCarrito)
routerCarrito.post('/:id/productos/:id_prod', agregarItemAlCarrito)
routerCarrito.post('/:id/productos/', agregarVariosItemsAlCarrito)
routerCarrito.delete('/:id/productos/:id_prod', borrarItemDelCarrito)
routerCarrito.post('/:id/finalizarCompra', enviarConfirmacion )

// routerCarrito.post('/:id/finalizarCompra', (req,res)=>{

//     let id = req.params.id
//     enviarEmailPedido(id)
//     res.send('Compra finalizada')
// })

export default routerCarrito
