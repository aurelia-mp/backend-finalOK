import { CPU_CORES } from '../../index.js';
import { generateHashPassword, verifyPass } from '../bcrypt.js';
import {users} from '../routers/routerAuth.js'
import {enviarEmail} from '../../scripts/mailer.js';

async function saveUser(user){
    // Por defecto, todo usuario nuevo se guarda como NO ADMIN
    user = {
        ...user,
        admin: false
    }
    const userSave = users.save(user)
    return userSave
}

const mostrarDatosProcesos = (req,res)=>{
    const datos = {
        argumentos: process.argv.slice(2),
        plataforma: process.platform,
        version: process.version,
        rss: process.memoryUsage(),
        path: process.execPath,
        pid: process.pid,
        carpeta: process.cwd(),
        procesadores: CPU_CORES
    }
    console.log(datos)
    res.render('info', {datos: datos})
}

let user

const autenticarUsuario = (req,res) =>{
    const nombre = req.session.passport.user.username
    const email = req.session.passport.user.email
    res.render('main',  {nombre: nombre, email: email})
}

const desloggearUsuario = (req, res) => {
    res.render('logout', {nombre: req.session.passport.user.username})
    req.session.destroy(err=>{
        if(err){
            logError(err.message)
            res.json({status: 'Error al desloggearse', body: err})
        }
    })
}

const mostrarDatosUsuario = (req,res)=>{
    user = req.session.passport.user
    res.render('datosPersonales', {usuario: user})
}

const getLogin = (req, res) => {
    res.render('login')
}

const getLoginError = (req, res) => {
    res.render('login-error')
}

const getRegister = (req,res)=>{
    res.render('register')
}

const postRegister =  async (req,res) =>{
    let{ username, email, tel, password } = req.body
    const newUser = {
        username: username,
        email: email,
        tel: tel,
        password: await generateHashPassword(password)
    }
    
    saveUser(newUser)
    .then((res)=>{
        console.log(res)
        enviarEmail(newUser)
    })
    
    // req.session.nombre = nombre
    res.redirect('/login');
}

const postLogin = (req, res) => {

    res.cookie('userEmail', req.session.passport.user)
}

export {
    mostrarDatosProcesos,
    autenticarUsuario,
    desloggearUsuario,
    user,
    mostrarDatosUsuario,
    getLogin,
    getLoginError,
    getRegister, 
    postRegister,
    postLogin
} 