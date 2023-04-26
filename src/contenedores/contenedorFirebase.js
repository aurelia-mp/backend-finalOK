import { resolveInclude } from "ejs";
import admin from "firebase-admin"
import config from '../config.js'
import {logError} from '../../scripts/loggers/loggers.js'
import CustomError from '../clases/CustomError.class.js'


admin.initializeApp({
    credential: admin.credential.cert(config.firebase)
})

const db = admin.firestore();

class ContenedorFirebase{
    constructor(nombreColeccion) {
        this.coleccion = db.collection(nombreColeccion)
    }

    async save(objeto){
        try{
            let id = 1
            const cantidadRegistros = await this.coleccion.count().get()
            if(cantidadRegistros.data().count > 0){
                id = (cantidadRegistros.data().count) +1
            }          
            let nuevoDoc= this.coleccion.doc(`${id}`)
            objeto={
                ...objeto,
                id: id
            }
            await nuevoDoc.create(objeto)
            return id
        }
        catch(err){
            const custError = new CustomError(500, 'Error al guardar', err)
            logError(custError)
            throw custError
        }
    }

    async getById(number){
        try{
            number = parseInt(number)
            const doc = this.coleccion.doc(`${number}`)
            let registro = await doc.get()
            // Transforma la respuesta en un array para que funcione el método getCarrito
            let arrayRespuesta = []
            arrayRespuesta.push(registro.data())
            return registro? arrayRespuesta : null 
        } catch(err){
            const custError = new CustomError(500, 'Error con el método getById', err)
            logError(custError)
            throw custError
        }
    }

    async udpateById(id, cambios){
        try{
            const doc = this.coleccion.doc(id)
            console.log(cambios)
            let registro = await doc.update(cambios)
            let registroActualizado = await doc.get()
            return registro ? registroActualizado.data() : null
        }
        catch(err){
            const custError = new CustomError(500, 'Error con el método updateById', err)
            logError(custError)
            throw custError
        }
    }

    async getAll(){
        try{
            const read = await this.coleccion.get()
            const registros = read.docs
            const registrosFormateados = registros.map((registro) => ({
                id: registro.id,
                ...registro.data()
            }))
            console.log(registrosFormateados)
            return registrosFormateados
        }
        catch(error){
            const custError = new CustomError(500, 'Error con el método getAll', err)
            logError(custError)
            throw custError
        }

    }

    async deleteById(number){
        try{
            const doc = this.coleccion.doc(number)
            let docBorrado = await doc.delete()
            return docBorrado ? docBorrado  : null
        }catch(err){
            const custError = new CustomError(500, 'Error con el método deleteById', err)
            logError(custError)
            throw custError
        }
    }

    async deleteAll(){
        try{

            // Desde documentación de firebase
            const registros = await this.coleccion.get()

            const batchSize = registros.size
            if (batchSize === 0){
                resolveInclude()
                return
            }

            const batch = db.batch()
            registros.docs.forEach((doc)=>{
                batch.delete(doc.ref)
            })
            await batch.commit()
            return
        }
        catch(err){
            const custError = new CustomError(500, 'Error con el método deleteAll', err)
            logError(custError)
            throw custError
        }
    }
}

export default ContenedorFirebase