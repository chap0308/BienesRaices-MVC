import { unlink } from 'node:fs/promises' 
import { validationResult } from "express-validator";
import { Propiedad, Categoria, Mensaje, Precio, Usuario } from "../models/index.js";
import { esVendedor, formatearFecha  } from '../helpers/index.js'

const admin = async (req,res)=>{

    // Leer QueryString(es diferente al req.param)
    const { pagina: paginaActual } = req.query;//acá renombramos la variable pagina que sale en el query a paginaActual
    
    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)) {//con esto comprobamos que exista la variable y que tenga las condiciones de la expresion regular
        return res.redirect('/mis-propiedades?pagina=1')
    }
    try {
        const { id }=req.usuario;

        // Limites y Offset para el paginador
        const limit = 4
        const offset = ((paginaActual * limit) - limit)

        const [propiedades, total] = await Promise.all([//las variables son los resultados en orden de las consultas( el primero es de findAll y el segundo es de count)
            Propiedad.findAll({
                limit,
                offset,
                where: {
                    usuarioId : id
                },
                include:[
                    //ESTO VIENE DE LA TABLA DE RELACIONES(models/index.js)
                    { model: Categoria, as: 'categoria'},// incluimos la tabla categoria que coincida con el categoriaId
                    { model: Precio, as: 'precio'},
                    { model: Mensaje, as: 'mensajes' }
                ],
            }),
            Propiedad.count({
                where: {
                    usuarioId : id
                }
            })
        ])

        res.render('propiedades/admin', {
            pagina: 'Mis Propiedades',
            propiedades,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            total,
            offset,
            limit
        })
    } catch (error) {
        console.log(error)
    }

}
//Fomrulario de crear propiedad
const crear = async (req,res)=>{
    //Consultar Modelo de Precio y Categoria
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render("propiedades/crear",{
        pagina:"Crear propiedad",
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos:{}//para que no nos marque undifined en el value de los inputs, al inicio cuando entramos a la pagina
    })
}

const guardar = async (req,res)=>{
    //Validacion
    let resultado= validationResult(req);

    if(!resultado.isEmpty()){
        //Consultar Modelo de Precio y Categoria
        const [categorias, precios] = await Promise.all([//se llama otra vez, para verlo en el formulario
            Categoria.findAll(),
            Precio.findAll()
        ])

        res.render("propiedades/crear",{
            pagina:"Crear propiedad",
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }

    //Validacion correcta
    const {titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria} = req.body;
    //precio: precioId, lo que se hace es asignar el nombre de la variable precio (viene del name de HTML) a precioId y solo tendrías que colocar el ultimo nombre abajo

    const { id: usuarioId }= req.usuario;

    try {
        const propiedadGuardada = await Propiedad.create({
            titulo, //titulo :titulo (pero no es necesario)
            descripcion, 
            habitaciones, 
            estacionamiento, 
            wc, 
            calle, 
            lat, 
            lng, 
            precioId,//mejor manera, pero el de abajo es más entendible
            categoriaId: categoria,// tambien se puede hacer así, lo que se hace es colocar la variable de la base de datos para que sea igual a la variable del HTML
            usuarioId,
            imagen:''
        })
        const { id } = propiedadGuardada;//el id generado tiene que salirte tipo así: 10d7e41b-fafd-468e-9392-94d714efda48

        res.redirect(`/propiedades/agregar-imagen/${id}`);

    }catch (error) {
        console.log(error);
    }

}

const agregarImagen = async (req,res)=>{
    const { id } = req.params;
    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    if(!propiedad){
        return res.redirect("/mis-propiedades");
    }
    //Validar que la propiedad no este publicada
    if(propiedad.publicado){//si ya está publicada, entonces:
        return res.redirect("/mis-propiedades");
    }

    //Validar que la propiedad pertenezca al usuario correcto( es decir que la propiedad sea de quien lo visita)
    if(req.usuario.id.toString()  !== propiedad.usuarioId.toString()){//le ponenmos toString porque en MongoDB u otros ORMs no lo consideraran iguales. (Tomar en cuenta)
        return res.redirect("/mis-propiedades");
    }
    let pagina=`Agregar Imagen: ${propiedad.titulo}`
    let mensaje="Publicar Propiedad"

    if(propiedad.imagen!=''){
        pagina=`Editar Imagen: ${propiedad.titulo}`
        mensaje="Editar Imagen"
    }

    res.render("propiedades/agregar-imagen",{
        pagina,
        csrfToken: req.csrfToken(),
        propiedad,
        mensaje
    })
}

const almacenarImagen = async (req,res, next)=>{ 
    const { id } = req.params;
    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    if(!propiedad){
        return res.redirect("/mis-propiedades");
    }
    //Validar que la propiedad no este publicada
    if(propiedad.publicado){//si ya está publicada, entonces:
        return res.redirect("/mis-propiedades");
    }

    //Validar que la propiedad pertenezca al usuario correcto( es decir que la propiedad sea de quien lo visita)
    if(req.usuario.id.toString()  !== propiedad.usuarioId.toString()){//le ponenmos toString porque en MongoDB u otros ORMs no lo consideraran iguales. (Tomar en cuenta)
        return res.redirect("/mis-propiedades");
    }

    try {
        console.log(req.file);//ver las propiedades del archivo
        //Editar imagen si existe( eliminar y crear )
        if(propiedad.imagen!=""){
            await unlink(`public/uploads/${propiedad.imagen}`)
            propiedad.imagen = req.file.filename;
            await propiedad.save();
            return next();
        }
        
        //Almacenar la imagen y publicar la propiedad
        propiedad.imagen = req.file.filename;
        propiedad.publicado = 1;
        //Guardar en la base de datos
        await propiedad.save();

        // res.redirect("/mis-propiedades");
        next();//puedes usar esto o el de arriba, pero recuerda que el que redirige está en src/js/agregarImagen.js --> init:function()
    }catch (error) {
        console.log(error);
    }
}

const editar = async (req,res)=>{

    const { id } = req.params;
    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad){
        return res.redirect("/mis-propiedades");
    }
    
    if(propiedad.publicado){
        return res.redirect("/mis-propiedades");
    }

    //Validar que la propiedad pertenezca al usuario correcto( es decir que la propiedad sea de quien lo visita)
    if(req.usuario.id.toString()  !== propiedad.usuarioId.toString()){//le ponenmos toString porque en MongoDB u otros ORMs no lo consideraran iguales. (Tomar en cuenta)
        return res.redirect("/mis-propiedades");
    }

    //Consultar Modelo de Precio y Categoria
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render("propiedades/editar",{
        pagina:`Editar propiedad: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos:propiedad//datos para mostrar en los inputs
    })
}

const guardarCambios = async (req,res)=>{
    // Verificar la validación
    let resultado = validationResult(req)

    if(!resultado.isEmpty()) {

        // Consultar Modelo de Precio y Categorias
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render('propiedades/editar', {
            pagina: 'Editar Propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }

    const {id} = req.params

    // Validar que la propiedad exista (lo coloca de nuevo para tener más seguridad)
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la URl, es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString() ) {
        return res.redirect('/mis-propiedades')
    }

    // Reescribir el objeto y actualizarlo
    try {

        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body
        //lo hacemos de esta manero porque a comparacion de la funcion "crear", la variable propiedad está creada acá y sí se le puede colocar un set a esta variable
        propiedad.set({//.set() es un metodo de sequelize que permite actualizar los datos de un objeto
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId
        })
        
        await propiedad.save();

        res.redirect('/mis-propiedades')
        
    } catch (error) {
        console.log(error)
    }
}   

const eliminar = async (req,res)=>{
    //colocar la seguridad en todo
    const {id} = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la URl, es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString() ) {
        return res.redirect('/mis-propiedades')
    }
    //finalmente:

    // Eliminar la imagen
    await unlink(`public/uploads/${propiedad.imagen}`)
    console.log(`Se eliminó la imagen ${propiedad.imagen}`)

    // Eliminar la propiedad
    await propiedad.destroy()
    res.redirect('/mis-propiedades')
}

// Modifica el estado de la propiedad
const cambiarEstado = async (req, res) => {

    const {id} = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la URl, es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString() ) {
        return res.redirect('/mis-propiedades')
    }

    // Actualizar
    propiedad.publicado = !propiedad.publicado

    await propiedad.save()

    res.json({
        resultado: true
    })
}

const mostrarPropiedad = async (req,res)=>{
    const {id} = req.params

    // Comprobar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include : [
            { model: Precio, as: 'precio' },
            { model: Categoria, as: 'categoria', scope: 'eliminarPassword' },
        ]
    })

    if(!propiedad || !propiedad.publicado) {
        return res.redirect('/404')
    }


    res.render('propiedades/mostrar', {
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId )
    })
}

const enviarMensaje = async (req, res) => {
    const {id} = req.params

    // Comprobar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include : [
            { model: Precio, as: 'precio' },
            { model: Categoria, as: 'categoria' },
        ]
    })

    if(!propiedad) {
        return res.redirect('/404')
    }

    // Renderizar los errores
        // Validación
    let resultado = validationResult(req)

    if(!resultado.isEmpty()) {

        return res.render('propiedades/mostrar', {
            propiedad,
            pagina: propiedad.titulo,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId ),
            errores: resultado.array()
        })
    }
    const { mensaje } = req.body
    const { id: propiedadId} = req.params
    const { id: usuarioId} = req.usuario//esto viene de la funcion identificarUsuario

    //VOLVER PARA HACER UNA SUBCONSULTA

    //fecha_datos+2<hoy{
    //     puedes enviar mensaje
    // }else{
    //     no puedes enviar mensaje
    // }
    

    // SELECT * from mensajes where propiedadId='10d7e41b-fafd-468e-9392-94d714efda48' and usuarioId='2' and (
    // SELECT DATE_ADD(createdAt, INTERVAL 2 DAY)
    // ) < NOW();
    //---------------------------------------------

    // const datos = { usuarioId, propiedadId }
    // //MEDIANTE UNA COOKIE PERO LO MEJOR ES HACERLO EN CONSULTA
    // const tokenMensaje =generarJWTMensaje({usuario: datos.usuarioId, propiedad: datos.propiedadId})
    // // console.log(token);//para ver el token en la terminal
    // //Almacenar en un cookie
    // res.cookie('_tokenMensaje', tokenMensaje, {
    //     httpOnly: true,
    //     // expires: 9000,
    //     // secure: true,
    //     // sameSite: true
    // }).redirect('/')

    //--------------------------------------
    // Almacenar el mensaje
    await Mensaje.create({
        mensaje,
        propiedadId,
        usuarioId
    })

    // res.render('propiedades/mostrar',{
    //     propiedad,
    //     pagina: propiedad.titulo,
    //     csrfToken: req.csrfToken(),
    //     usuario: req.usuario,
    //     esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId ),
    //     enviado: true
    // })
    res.redirect('/')

}

// Leer mensajes recibidos
const verMensajes = async (req, res) => {

    const {id} = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Mensaje, as: 'mensajes', //solo es necesario los mensajes para esta consulta
                include: [//esto es como un inner join y lo usamos dentro de Mensaje para que coincida con el usuarioId y la tabla Usuario
                    {model: Usuario.scope('eliminarPassword'), as: 'usuario'}
                ]
            },
        ],
    })

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la URl, es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString() ) {
        return res.redirect('/mis-propiedades')
    }

    res.render('propiedades/mensajes', {
        pagina: 'Mensajes',
        mensajes: propiedad.mensajes,
        formatearFecha//esta es una funcion que se encuentra en el archivo helpers.js y lo usaremos en las vistas
    })
}



export{
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    cambiarEstado,
    mostrarPropiedad,
    enviarMensaje,
    verMensajes
    
}