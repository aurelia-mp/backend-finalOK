import mongoose from "mongoose";
import config from "../config.js";
import {logInfo, logError} from '../../scripts/loggers/loggers.js'
import CustomError from "./CustomError.class.js";
import DBClient from "./DBClient.class.js";

class MongoDBClient extends DBClient {
    constructor(){
        super();
        this.connected = false;
        this.client = mongoose;
    }

    async connect(){
        try {
            await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)

            this.connected = true;
            logInfo('Base de datos conectada');
        } catch (error) {
            const objErr = new CustomError(500, "Error al conectarse a mongodb", error);
            logError(objErr);
            throw objErr;
        }
    }

    async disconnect(){
        try {
            await this.client.connection.close();
            this.connected = false;
            logInfo('Base de datos desconectada');
        } catch (error) {
            const objErr = new CustomError(500, "Error al desconectarse a mongodb", error);
            logError(objErr);
            throw objErr;
        }
    }
}

export default MongoDBClient;