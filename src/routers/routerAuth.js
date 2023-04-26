import express from 'express'
const routerAuth = express.Router()
import passport from "passport";
import { Strategy } from "passport-local";
const LocalStrategy = Strategy;
// import * as model from '../models/users.js'
import { verifyPass } from '../bcrypt.js';

import { logError } from '../../scripts/loggers/loggers.js'
import {mostrarDatosProcesos, autenticarUsuario, desloggearUsuario, user, mostrarDatosUsuario, getLogin, getLoginError, getRegister, postRegister, postLogin } from '../controllers/controllersAuth.js';

const { default: UsersMongoDb } = await import('../models/usersMongoDb.js')

export const users = new UsersMongoDb()


// FUNCIONES
function isAuth(req,res,next){
    if(req.isAuthenticated()){
        next()
    }
    else{
        res.redirect('/login')
    }
}

// Passport local
let usuarioActual
let idCarrito

passport.use('local', new LocalStrategy(
    async function(username, password, done){
        // const existeUsuario = await model.usuarios.findOne({email: username})
        const existeUsuario = await users.getByEmail(username)
        // usuarioActual = existeUsuario
        if(!existeUsuario){
            console.log('usuario no encontrado')
            return done(null, false)
        }
        else{
            const match = await verifyPass(existeUsuario, password)
            if (!match) {
                return done(null, false)
            }
            return done(null, existeUsuario);
        }
    }
))

passport.serializeUser((usuario, done) => {
    done(null, usuario);
});

passport.deserializeUser((nombre, done) => {
    users.getByUsername(nombre)
    .then((res=>{
        done(null,res)
    }))
    .catch((err) =>{
        logError(err)
        console.log('error desde deserializacion' + err)
    })
    // model.usuarios.find({username: nombre})
    // .then((res=>{
    //     console.log(res)
    //     done(null, res)
    // }))
    // .catch((err) =>{
    //     logError(err.message)
    //     console.log('error desde deserializacion' + err)
    // })
});

// RUTAS
routerAuth.use(passport.initialize())
routerAuth.use(passport.session());

routerAuth.get('/', isAuth, autenticarUsuario)
routerAuth.get('/logout', desloggearUsuario)
routerAuth.get('/login', getLogin)
routerAuth.get('/login-error', getLoginError)
routerAuth.get('/register',getRegister)
routerAuth.get('/datosPersonales', mostrarDatosUsuario)
routerAuth.post('/register',postRegister)
routerAuth.post(
    '/login', 
    passport.authenticate('local', {
        successRedirect:'/', 
        failureRedirect: '/login-error'
    }),
    postLogin
)

// PROCESS: Ruta info con datos del proceso
routerAuth.get('/info', mostrarDatosProcesos)


export {routerAuth, usuarioActual, idCarrito}