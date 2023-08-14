import { check,  validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import Usuario  from '../models/Usuario.js';
import { generarId, generarJWT } from '../helpers/tokens.js'
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";
// import * as next from 'next';

const formularioLogin = (req, res) => {
    res.render('auth/login',{
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    });
}
const autenticar = async (req, res) => {
    //Validacion
    await check('email').isEmail().withMessage('El email es Obligatorio').run(req)
    await check('password').isLength({ min: 6 }).withMessage('El Password es Obligatorio').run(req)
    let resultado = validationResult(req);
    //Verificar que el resultado no este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/login',{
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    }

    //Extraer los datos
    const {email, password} = req.body;
    //Consultar si el usuario existe
    const usuario = await Usuario.findOne({ where :{ email } });
    //Si no existe el usuario:
    if(!usuario){
        return res.render('auth/login',{
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no existe'}]//solo itera un valor
        });
    }
    
    //Comprobar si el usuario no esta confirmado:
    if(!usuario.confirmado){
        return res.render('auth/login',{
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Tu cuenta no ha sido confirmada'}]
        });
    }
    //Revisar el password
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login',{
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El Password es Incorrecto'}]
        });
    }
    //Autenticar al usuario
    const token =generarJWT({id: usuario.id, nombre: usuario.nombre})
    // console.log(token);//para ver el token en la terminal
    //Almacenar en un cookie
    return res.cookie('_token', token, {
        httpOnly: true,
        // expires: 9000,
        // secure: true,
        // sameSite: true
    }).redirect('/mis-propiedades')

}

const cerrarSesion = (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}

const formularioRegistro = (req, res) => {

    res.render('auth/registro',{
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()//va en todos los formularios(importante) y en el html
    });
}

const registrar = async (req, res) => {
    //Validacion check(dependencia instalada)
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
    await check('password').isLength({ min: 6 }).withMessage('El Password debe ser de al menos 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Los Passwords no son iguales').run(req)

    let resultado = validationResult(req);//dependencia instalada
    
    //Verificar que el resultado no este vacio
    if(!resultado.isEmpty()){//si no está vacio resultado, entonces es porque hay errores.
        //Errores
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }
    //Pero si está vacio resultado, entonces no hay errores y se puede continuar:

    //Extraer los datos
    const {nombre, email, password} = req.body;

    //Verificar que el usuario no este registrado
    const existeUsuario = await Usuario.findOne({ where :{ email } });//busca la variable email que colocamos, algo así es where :{ email: req.body.email  } 
    if(existeUsuario){
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario ya esta registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    // const usuario= await Usuario.create(req.body);
    // res.json(usuario);

    //Almacenar un usuario
    const usuario=await Usuario.create({//crea la fila en la tabla (es como si fuera insert into)
        nombre,
        email,
        password,
        token: generarId(),
    });

    //Enviar email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })


    //Mostrar mensaje de confirmacion, NO TE ENVIA A ESA RUTA SOLO MUESTRA EL MENSAJE Y CONTENIDO
    res.render('templates/mensaje',{
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos enviado un Email de confirmacion, presiona en el enlace'
    });

}

//Función que comprueba una cuenta
const confirmar = async (req, res) => {
    const { token } = req.params;//parametro que viene por la url

    //Verificar que el token sea valido
    const usuario = await Usuario.findOne({ where :{ token } });
    if(!usuario){
        return res.render('auth/confirmar-cuenta',{
            pagina: 'Error al Confirmar Cuenta',
            mensaje: 'No existe un usuario con este token, intenta de nuevo',
            error: true
        });
    }
    //Confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    console.log(usuario);//ver en la terminal
    await usuario.save();//guardar en la base de datos

    //Mostrar mensaje de confirmacion
    res.render('auth/confirmar-cuenta',{
        pagina: 'Cuenta Confirmada Correctamente',
        mensaje: 'La cuenta ha sido confirmada correctamente'
    });

    // next();//funciona como un break, para que no se siga cargando la pagina, se coloca en los parentesis (req,res,next)

}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password',{
        pagina: 'Recupera tu acceso a Bienes Raices',
        csrfToken: req.csrfToken(),
    
    });
}

const resetPassword = async (req, res) => {
    //Validacion
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
    
    let resultado = validationResult(req);//dependencia instalada

    //Verificar que el resultado no este vacio
    if(!resultado.isEmpty()){
        //Errores
        return res.render('auth/olvide-password',{
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    }
    //Buscar el usuario por su email
    const {email} = req.body;
    const usuario = await Usuario.findOne({ where :{ email } });
    //ver en la consola(terminal):
    // if(usuario){
    //     console.log(`existe el usuario ${usuario.nombre}`);//ver en la terminal
        
    // }else{
    //     console.log(`no existe el usuario`);//ver en la terminal
    // }
    // next();//recuerda colocar el next en los parentesis (req,res,next) para hacer pruebas en la terminal

    if(!usuario){
        return res.render('auth/olvide-password',{
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'No existe un usuario con este email'}],
        });
    
    }
    if(usuario.token){
        return res.render('auth/olvide-password',{
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Ya se ha enviado un token a su email para reestablecer su contraseña, por favor revíselo'}],
        });
    }
    //Generar el token
    usuario.token = generarId();
    usuario.confirmado=false;
    await usuario.save();
    //Enviar email
    emailOlvidePassword({
        email: usuario.email,//arriba tenemos la instancia de email (lin 141), se puede usar y quedaría algo así: email: email, o email,
        nombre: usuario.nombre,
        token: usuario.token
    })
    //Mostrar mensaje de confirmacion
    res.render('templates/mensaje',{
        pagina: 'Reestablece tu Password',
        mensaje: 'Hemos enviado un email con las instrucciones'
    })

}

const comprobarToken = async (req, res) => {
    const { token } = req.params;//parametro que viene por la url
    //Verificar que el token sea valido
    const usuario = await Usuario.findOne({ where :{ token } });
    if(!usuario){
        return res.render('auth/confirmar-cuenta',{
            pagina: 'Reestablece tu Password',
            mensaje: 'Hubo un error al validar el token, intenta de nuevo',
            error: true
        });
    }
    //Mostrar formulario para modificar el password
    res.render('auth/reset-password',{
        pagina: 'Reestablece tu Password',
        csrfToken: req.csrfToken(),
    })
}

const nuevoPassword = async (req, res) => {
    //Validar el password
    await check('password').isLength({ min: 6 }).withMessage('El Password debe ser de al menos 6 caracteres').run(req)
    let resultado = validationResult(req);
    
    //Verificar que el resultado no este vacio
    if(!resultado.isEmpty()){//si hay errores:
        //Errores
        return res.render('auth/reset-password',{
            pagina: 'Reestablece tu Password',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    }
    
    
    //Si no hay errores:
    const { token } = req.params;//parametro que viene por la url
    const { password } = req.body;
    
    // console.log(password);//tener en cuenta que si recargas la pagina, el password se mantiene en el req.body. Por eso hacemos la validacion del usuario, para que no se ejecute lo demás.
    //Identificar al usuario por su token
    const usuario = await Usuario.findOne({ where :{ token } });
    if(usuario){
        //Hashear el nuevo password
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);
        usuario.token = null;
        usuario.confirmado = true;
        //Guardar el nuevo password
        await usuario.save();
        return res.render('auth/confirmar-cuenta',{
            pagina: 'Password Reestablecido',
            mensaje: 'El Password se guardó correctamente'
        })
    }

    res.render('auth/confirmar-cuenta',{
        pagina: 'Reestablece tu Password',
        mensaje: 'Hubo un error al validar el token, intenta de nuevo',
        error: true
    });

}

export {
    formularioLogin,
    autenticar,
    cerrarSesion,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}