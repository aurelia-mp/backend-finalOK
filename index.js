import express from "express";
import { Server as httpServer } from 'http'
import { Server as ioServer } from 'socket.io'
import mongoose from "mongoose";
import session from 'express-session'
import routerProductos from "./src/routers/routerProductos.js";
import routerCarrito from "./src/routers/routerCarrito.js";
import {routerAuth} from "./src/routers/routerAuth.js";
import handlebars from 'express-handlebars'
import config from './src/config.js'
import { logInfo, logWarn } from './scripts/loggers/loggers.js'
import cluster from 'cluster'
import os from 'os'
import ContenedorSQL from "./src/contenedores/contenedorSQL.js";

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const httpserver = new httpServer(app)
const io = new ioServer(httpserver, {
    cors:{
        origin:["*"]
    }
})

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
// Session
app.use(session(config.session))


// Mongo DB
mongoose.set('strictQuery', false)
const URL = config.mongodb.cnxStr
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//Loggeo de todas las peticiones
app.use((req, res, next) =>{
    logInfo(`${req.method} ${req.url}`)
    next()
})

// Routers
app.use('/api/productos', routerProductos)
app.use('/api/carritos', routerCarrito)
app.use('/', routerAuth)

// Loggeo de rutas inexistentes
app.use('*', (req, res, next) => {
    logWarn(`ruta ${req.originalUrl} método ${req.method} no implementada`)
    next()
})

//  Archivos estáticos
app.use('/upload', express.static('upload'))
app.use(express.static('public'))

// Configuración Handlebars
app.engine('hbs', 
    handlebars({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir:__dirname+'/views/layouts',
        partialsDir: __dirname+'/views/partials'
    }))

app.set('views', './views')
app.set('view engine', 'hbs')

// Ruta raíz
app.get('', (req, res)=>{
    res.render('main')
})

app.get('*', ((req, res) => {
    res.send({ status: "error: -2", description: `ruta ${req.url} método ${req.method} no implementada` });
}))

// Mensajes
const mensajes = new ContenedorSQL(config.sqlite3, 'mensajes')

// Implementación de websocket
io.on('connection', socket =>{
    // Al conectarse un nuevo usuario, aparece el historial de mensajes anteriores
    mensajes.getAll()
    .then((mjes) =>{
        socket.emit('mensajes', mjes)
    })
    
    // Recibo un mensaje nuevo
    socket.on('nuevoMensaje', mje =>{
        let fecha = new Date().toLocaleString()
        let mensaje = {
            ...mje,
            "fecha": fecha
        }
        mensajes.save(mensaje)
        .then(() => {
            mensajes.getAll()
            .then((lista =>{
                io.sockets.emit('mensajes', lista)
            }))
        })
    })
})

// Inicio el servidor
export const CPU_CORES = os.cpus().length
if (config.mode == 'CLUSTER' && cluster.isPrimary) {
    logInfo('Cantidad de cores: ', CPU_CORES)
    
    for (let i = 0; i < CPU_CORES; i++) {
        cluster.fork()
    }
    
    cluster.on('exit', worker => {
        logInfo(`Worker finalizó proceso ${process.pid} ${worker.id} ${worker.pid} finalizó el ${new Date().toLocaleString}`)
        cluster.fork()
    })
} else {
    const server = httpserver.listen(config.PORT, err => {
        if (!err) logInfo(`Servidor http escuchando en el puerto ${config.PORT} - PID: ${process.pid}`)
    })
    server.on('error', error => {
        logError(error)    
    })
}