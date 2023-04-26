import log4js from "log4js";

log4js.configure({
    // Ruta y método de todas las peticiones recibidas por el servidor (info)
    //Ruta y método de las peticiones a rutas inexistentes en el servidor (warning)
    //Errores lanzados por las apis de mensajes y productos, únicamente (error)
    // Loggear todos los niveles a consola (info, warning y error)
    //Registrar sólo los logs de warning a un archivo llamada warn.log
    //Enviar sólo los logs de error a un archivo llamada error.log

    appenders:{
        myLoggerConsole: {type: 'console'}, 
        loggerFileWarn: {type:'file', filename: './logs/warn.log'},
        loggerFileError: {type: 'file', filename: './logs/error.log'}
        
    },
    categories:{
        warn: {appenders: ['loggerFileWarn'], level: 'warn'},
        error: {appenders: ['loggerFileError'], level: 'error'},
        default: {appenders: ['myLoggerConsole'], level: 'info'},
    }
})

const loggerInfo= log4js.getLogger()
const loggerWarn = log4js.getLogger('warn')
const loggerError = log4js.getLogger('error')

export function logInfo(msg) {
    loggerInfo.info(msg)
}

export function logWarn(msg) {
    loggerWarn.warn(msg)
}

export function logError(msg){
    loggerError.error(msg)
}