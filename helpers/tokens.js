import jwt from 'jsonwebtoken';


//Generar JWT
const generarJWT = datos => jwt.sign({ id : datos.id, nombre: datos.nombre }, process.env.JWT_SECRET, { expiresIn: '1d' })

const generarJWTMensaje = datos => jwt.sign({ usuario : datos.usuarioId, propiedad: datos.propiedadId }, process.env.JWT_SECRET, { expiresIn: '2d' })


const generarId= ()=> Math.random().toString(32).substring(2) + Date.now().toString(32);

export {
    generarId,
    generarJWT,
    generarJWTMensaje
}