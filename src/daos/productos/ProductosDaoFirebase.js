import ContainerFirebase from "../../contenedores/contenedorFirebase.js"

class ProductosDaoFirebase extends ContainerFirebase {

    constructor() {
        super('productos')
    }
}

export default ProductosDaoFirebase