import mongoose from 'mongoose'
import CustomError from '../clases/CustomError.class.js'
import MongoDBClient from '../clases/MongoDBClient.class.js'
import {logInfo, logError} from '../../scripts/loggers/loggers.js'


class containerMongo {
    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema)
        this.connexion = new MongoDBClient()
    }

    async save(objeto){
        try{
            await this.connexion.connect()

            let objetoGuardado = await this.coleccion.insertMany(objeto)
            logInfo(objetoGuardado)
            return objetoGuardado[0]['_id']
        }
        catch(err){
            const custError = new CustomError(500, 'Error al guardar', err)
            logError(custError)
            throw custError
        } 
    }

    async getById(number){
        try{
            await this.connexion.connect()

            const registroBuscado = await this.coleccion.findById({_id: number}).lean()
            return registroBuscado ? registroBuscado 
                    : null
        } catch(err){
            const custError = new CustomError(500, 'Error con el método getById', err)
            logError(custError)
            throw custError
        } 
    }

    async getByEmail(email){
        try{
            await this.connexion.connect()
            return this.collection.findOne({email: email}).lean()
            .then(result => {
                if(result) {
                  console.log(`Successfully found document: ${result}.`);
                } else {
                  console.log("No document matches the provided query.");
                }
                return result;
              })
              .catch(err => console.error(`Failed to find document: ${err}`));
        } catch(err){
            const custError = new CustomError(500, 'Error con el método getByEmail', err)
            logError(custError)
            throw custError
        } 
    }

    async getByUsername(name){
        try{
            await this.connexion.connect()

            const registroBuscado = await this.coleccion.find({username: name}).lean()
            return registroBuscado ? registroBuscado 
                    : null
        } catch(err){
            const custError = new CustomError(500, 'Error con el método getByUsername', err)
            logError(custError)
            throw custError
        } 
    }

    async udpateById(id, cambios){
        try{
            await this.connexion.connect()
            
            const registroActualizado = await this.coleccion.findByIdAndUpdate({_id: id}, cambios, {new:true})   
            return registroActualizado ? registroActualizado : null
        } catch(err){
            const custError = new CustomError(500, 'Error con el método updateById', err)
            logError(custError)
            throw custError
        } 
    }

    async getAll(){
        try{
           await this.connexion.connect()

            const registros = await this.coleccion.find({}).lean() 
            logInfo(registros)
            return registros
        } catch(error){
            const custError = new CustomError(500, 'Error con el método getAll', err)
            logError(custError)
            throw custError
        }
    }
    
    async deleteById(number){
        try{
           await this.connexion.connect()

            let itemABorrar = await this.coleccion.findByIdAndDelete({_id: number})
            return itemABorrar ?  await this.coleccion.find({}) : null
        } catch(err){
            const custError = new CustomError(500, 'Error con el método deleteById', err)
            logError(custError)
            throw custError
        } 
    }

    async deleteAll(){
        try{
            await this.connexion.connect()

            await this.coleccion.deleteMany({})
            logInfo('Todos los registros fueron borrados')
            return
        }
        catch(err){
            const custError = new CustomError(500, 'Error con el método deleteAll', err)
            logError(custError)
            throw custError
        } 
    }
}

export default containerMongo