import ContainerFirebase from "../../contenedores/contenedorFirebase.js"

class CarritosDaoFirebase extends ContainerFirebase {

    constructor() {
        super('carritos')
    }

    async save(carrito = { productos: [] }) {
        return super.save(carrito)
    }
}

export default CarritosDaoFirebase
