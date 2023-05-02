import ContenedorFirebase from "../../contenedores/contenedorFirebase.js"

class ProductosDaoFirebase extends ContenedorFirebase {

    constructor() {
        super('productos')
    }
}

export default ProductosDaoFirebase