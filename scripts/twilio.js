import twilio from 'twilio'
import { logError} from './loggers/loggers.js'
import dotenv from 'dotenv'
dotenv.config()

// Configuración de Twilio 
// SID Y TOKEN con variables de entorno
// Los datos se encuentran en el dashboard de Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

// Inicializamos Twilio
const client = twilio(accountSid, authToken)

export default async function enviarWA(numero){
    const options = {
        // cuerpo del mensaje
        body: 'Su pedido ha sido recibido y está en proceso de preparación',
        from: 'whatsapp:+14155238886', // Número de Twilio - lo encontramos en el Sandbox
        to: `whatsapp:${numero}`
    }
    try{
        await client.messages.create(options)
    }
    catch(err){
        logError('Error de envío de WhatsApp por Twilio' + err)
    }
}
