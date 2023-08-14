import  jwt  from "jsonwebtoken";
import { Usuario } from "../models/index.js";


const protegerRuta= async (req,res,next)=>{
    //Verificar si hay token
    const {_token}= req.cookies;
    if(!_token){
        return res.redirect('/auth/login');
    }
    //Comprobar el token
    try {
        //tiene que ser la misma palabra secreta para generar( helpers/token.js --> generarJWT) y verificar el jwt
        const decoded= jwt.verify(_token, process.env.JWT_SECRET);
        //console.log(decoded);//VERIFICA EL JWT, SI NO LO ES, TE ENVIA AL CATCH               
                                                                                    //dataValues: { id: 1, nombre: 'Juan', email: 'juan@correo.com', password,token,confirmado,etc }
        const usuario= await Usuario.scope('eliminarPassword').findByPk(decoded.id);//borramos los atributos para que no se vea en la consola con el metodo scope(eliminarPassword) del modelo Usuario
                                                                                    //dataValues: { id: 1, nombre: 'Juan', email: 'juan@correo.com' } (Así se ve cuando se llama en consola despues de usar el scope del modelo Usuario)
        //Almacenar el usuario en el request(req)
        if(usuario){//para asegurarnos de que exista
            req.usuario=usuario;//acá pasamos el valor de usuario al req de la pagina de la consola para que se quede guardado(algo así como el localStorage)
        }else{
            return res.redirect('/auth/login');
        }
        return next();//este next es para que continue la siguiente funcion(en propiedadRoutes linea 8 sigue admin)
    } catch (error) {
        console.log(error);
        return res.clearCookie('_token').redirect('/auth/login');
    }

    
}

export default protegerRuta;