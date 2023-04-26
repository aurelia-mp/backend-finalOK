import { createTransport } from 'nodemailer';

const TEST_MAIL = 'marilou.schoen@ethereal.email'

const transporter = createTransport({
   host: 'smtp.ethereal.email',
   port: 587,
   auth: {
       user: TEST_MAIL,
       pass: 'bsahRqt64eRRFaFbCH'
   }
});


async function enviarEmail(datosUsuario){
    const mailOptions = {
        from: 'Servidor Node.js',
        to: TEST_MAIL,
        subject: 'Nuevo resgistro de usuario',
        html: `Nuevo registro de usuario: 
                <ul> 
                    <li>Username: ${datosUsuario.username}</li>
                    <li>email: ${datosUsuario.email}</li>
                    <li>teléfono: ${datosUsuario.tel}</li>
                </ul>`
     }
    try {
        const info = await transporter.sendMail(mailOptions)
        console.log(info)
     } catch (error) {
        console.log(error)
     }
     
}

async function enviarEmailPedido(id, items, usuario){   
    let listaHTMLItems = "<ul>"
    items.forEach((item) =>{
        listaHTMLItems = listaHTMLItems + "<li>" + item.nombre + "</li>"
    })
    listaHTMLItems = listaHTMLItems + "</ul>"

    let username
    usuario && (username = usuario.username)

    const mailOptions = {
        from: 'Servidor Node.js',
        to: TEST_MAIL,
        subject: `Nuevo pedido de ${username}`,
        html: `Nueva compra con los siguientes items: ${listaHTMLItems}`
     }
    try {
        const info = await transporter.sendMail(mailOptions)
     } catch (err) {
        console.log(err)
     }
     
}



export {enviarEmail, enviarEmailPedido}

