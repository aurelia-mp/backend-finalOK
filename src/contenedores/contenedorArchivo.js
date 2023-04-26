import fs from 'fs/promises'
import CustomError from '../clases/CustomError.class.js'
import {logInfo, logError} from '../../scripts/loggers/loggers.js'

class ContenedorArchivo {
    constructor(path){
        this.path = path
    }

    async save(objeto){
        try{
            const dataFormateada= JSON.parse(await fs.readFile(this.path, 'utf-8'))
            let id = 1
            dataFormateada.length != 0 && (id=dataFormateada[dataFormateada.length-1].id + 1)
            dataFormateada.push(
                {...objeto,
                id: id
                })
            await fs.writeFile(this.path, JSON.stringify(dataFormateada, null, 2))
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
            const dataFormateada= JSON.parse(await fs.readFile(this.path, 'utf-8'))
            const elementoFiltrado = dataFormateada.filter((elem) => elem.id===number)
            return (elementoFiltrado.length !== 0) ? elementoFiltrado 
                    : null
        } catch(err){
            const custError = new CustomError(500, 'Error con el método getById', err)
            logError(custError)
            throw custError
        }
    }

    async getIndexById(number){
        try{
            number = parseInt(number)
            const dataFormateada= JSON.parse(await fs.readFile(this.path, 'utf-8'))
            const index = dataFormateada.findIndex((elem) => elem.id===number)
            if (index != -1) return index
            else return null
        } catch(err){
            const custError = new CustomError(500, 'Error con el método getIndexById', err)
            logError(custError)
            throw custError
        }
    }

    async udpateById(number, cambios){
        try{
            number = parseInt(number)
            const dataFormateada= JSON.parse(await fs.readFile(this.path, 'utf-8'))
            const index = dataFormateada.findIndex((elem) => elem.id===number)     
            
            console.log(index)

            if(index===-1){
                return null
            }

            let elementoActualizado = {
                ...dataFormateada[index],   
                ...cambios
            }

            dataFormateada[index] = elementoActualizado
            await fs.writeFile(this.path, JSON.stringify(dataFormateada, null, 2))
            return          
        } catch(err){
            const custError = new CustomError(500, 'Error con el método udpateById', err)
            logError(custError)
            throw custError
        }
    }

    async getAll(){
        try{
            const dataFormateada= JSON.parse(await fs.readFile(this.path, 'utf-8'))
            return dataFormateada
        }
        catch(err){
            const custError = new CustomError(500, 'Error con el método getAll', err)
            logError(custError)
            throw custError
        }
    }
    
    async deleteById(number){
        try{
            let dataFormateada = JSON.parse(await fs.readFile(this.path, 'utf-8'))
            const indexABorrar = dataFormateada.findIndex((elem) => elem.id === number)
            if (indexABorrar === -1){
                return null
            }

            dataFormateada.splice(indexABorrar,1)
            await fs.writeFile(this.path, JSON.stringify(dataFormateada, null, 2))
            return dataFormateada
        } catch(err){
            const custError = new CustomError(500, 'Error con el método deleteById', err)
            logError(custError)
            throw custError
        }
    }

    async deleteAll(){
        try{
            await fs.writeFile(this.path, JSON.stringify([], null, 'utf-8'), null)
            return
        } catch(error){
            const custError = new CustomError(500, 'Error con el método deleteAll', err)
            logError(custError)
            throw custError
        }
    }
}

export default ContenedorArchivo