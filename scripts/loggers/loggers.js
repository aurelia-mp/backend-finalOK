import log4js from "log4js";

log4js.configure({
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