import knex from 'knex'
import {logInfo, logError} from '../../scripts/loggers/loggers.js'

class ContenedorSQL {
    constructor(config,tabla){
        this.knex = knex(config) 
        this.tabla=tabla
    }

    async getAll(){
        try{
            let knexConnection = this.knex
            const data = await knexConnection.from(this.tabla).select('*')
            return data
        }
        catch(error){
            logError("error de lectura", error)
        }   
    }

    async save(objeto){
        try{
            let knexConnection=this.knex
            await knexConnection(this.tabla).insert(objeto)
            let lastId = await knexConnection(this.tabla).select('id').orderBy('id', 'desc').limit(1)
            return lastId
        }
        catch(err){
            logError('Error de guardado ' + err)
        }
    }

    async getById(number){
        try{
            let knexConnection=this.knex
            let objeto = await knexConnection(this.tabla).where('id', number)
            return objeto || null
        }
        catch (err){
            logError('Error con método getById' + err)
        }
    }

    async udpateById(id, cambios){
        try{
            let knexConnection = this.knex
            let update = await knexConnection(this.tabla).where('id', id).update(cambios)
            return update || null  
        }
        catch(error){ 
            logError("Error con método updateById ", error)
        } 
    }

    async deleteById(number){
        try{
            let knexConnection = this.knex
            // si no hay filas para borrar, deletedRows va a ser igual a 0
            let deletedRows = await knexConnection(this.tabla).where('id', number).del()
            return deletedRows || null
        }
        catch(error) {
            logError('Error con método deleteById', error)
        }
    }

    async deleteAll(){
        try{
            let knexConnection = this.knex
            knexConnection(this.tabla).del()
        }
        catch(err){
            logError('No se pudo borrar la base de datos', err)
        }
    }
}

export default ContenedorSQL