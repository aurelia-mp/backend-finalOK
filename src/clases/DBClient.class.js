import CustomError from "./CustomError.class.js";

class DBClient {
    async connect(){
        throw new CustomError(500, "Falta implementar", "método connect no implementando")
    }

    async disconnect(){
        throw new CustomError(500, "Falta implementar", "método disconnect no implementando")
    }
}

export default DBClient;