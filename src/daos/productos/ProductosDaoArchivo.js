import ContenedorArchivo from "../../contenedores/ContenedorArchivo.js"

class ProductosDaoArchivo extends ContenedorArchivo {

    constructor() {
        super('./DB/productos.json')
    }
}

export default ProductosDaoArchivo
