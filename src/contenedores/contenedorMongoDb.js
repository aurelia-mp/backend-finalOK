import mongoose from 'mongoose'
import config from '../config.js'
import CustomError from '../clases/CustomError.class.js'
import MongoDBClient from '../clases/MongoDBClient.class.js'
import {logInfo, logError} from '../../scripts/loggers/loggers.js'

// await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)

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
        } finally {
            // this.connexion.disconnect()
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
        } finally {
            this.connexion.disconnect()
        }
    }

    async getByEmail(email){
        try{
            await this.connexion.connect()

            const registroBuscado = await this.coleccion.findOne({email: email}).lean()
            return registroBuscado ? registroBuscado 
                    : null
        } catch(err){
            const custError = new CustomError(500, 'Error con el método getByEmail', err)
            logError(custError)
            throw custError
        } finally {
            this.connexion.disconnect()
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
        } finally {
            // this.connexion.disconnect()
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
        } finally {
            this.connexion.disconnect()
        }
    }

    async getAll(){
        try{
           await this.connexion.connect()

            const registros = await this.coleccion.find({}).lean() 
            // .lean transforma el objeto Mongoose en json
            logInfo(registros)
            return registros
        } catch(error){
            const custError = new CustomError(500, 'Error con el método getAll', err)
            logError(custError)
            throw custError
        } finally {
            this.connexion.disconnect()
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
        } finally {
           this.connexion.disconnect()
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
        } finally {
            this.connexion.disconnect()
        }
    }
}

export default containerMongo