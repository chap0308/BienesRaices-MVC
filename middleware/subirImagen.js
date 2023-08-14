import multer from 'multer'
import path from 'path'
import { generarId } from '../helpers/tokens.js'

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // console.log('Calling internal', file)
        // console.log('Value req', req)
        //IMPORTANTE:-------------------------------
        cb(null, './public/uploads/')//ruta donde se guardaran las imagenes, IMPORTANTE: CREAR LA CARPETA EN ESA RUTA
    },
    filename: function(req, file, cb) {
        cb(null, generarId() + path.extname(file.originalname) )
    }
})

const upload = multer({ storage })

export default upload