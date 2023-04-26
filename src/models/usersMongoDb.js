import containerMongo from "../contenedores/contenedorMongoDb.js"

let userSchema = {
    username: {type: String, required: true},
    email: {type: String, required: true},
    tel: {type: String, required: false},
    password: {type: String, required: true},
    admin: {type: Boolean, required:true}
}

class UsersMongoDb extends containerMongo {

    constructor() {
        super('usuarios', userSchema)
    }


}

export default UsersMongoDb


