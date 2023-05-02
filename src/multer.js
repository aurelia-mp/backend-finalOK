import multer from 'multer'

// Configuración de Multer
const storage=multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null, './upload')
    },
    filename: (req, file, cb) =>{
        cb(null, `${file.originalname}`)
    }
})

const upload = multer({storage: storage})

export default upload