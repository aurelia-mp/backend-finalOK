import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js"

class CarritosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super('carritos', {
            items: { type: [], required: true }
        },
            {timestamp: true})
    }

    async save(carrito = { items: [] }) {
        return super.save(carrito)
    }
}

export default CarritosDaoMongoDb
