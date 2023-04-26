import containerMongo from "../../contenedores/contenedorMongoDb.js"

class ProductosDaoMongoDb extends containerMongo {

    constructor() {
        super('productos', {
            nombre: { type: String, required: true },
            descripcion: {type: String},
            codigo: {type: Number, required: true},
            precio: { type: Number, required: true },
            stock: {type: Number, required: true},
            thumbnail: { type: String, required: true },
        })
    }
}

export default ProductosDaoMongoDb
