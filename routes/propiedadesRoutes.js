import express from 'express';
import {body} from 'express-validator';
import { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, cambiarEstado, mostrarPropiedad, enviarMensaje, verMensajes } from '../controllers/propiedadController.js';
import protegerRuta from '../middleware/protegerRuta.js';
import upload from '../middleware/subirImagen.js';
import identificarUsuario from "../middleware/identificarUsuario.js"

const router = express.Router();

//primero colocamos la funcion protegerRuta antes de que se ejecuten las demas funciones
router.get('/mis-propiedades', 
    protegerRuta, 
    admin
);

router.get('/propiedades/crear', 
    protegerRuta, 
    crear
);

router.post('/propiedades/crear', 
    protegerRuta,
    body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
    body('descripcion')
    .notEmpty().withMessage('La descripcion del anuncio es obligatoria')
    // .isLength({min: 20}).withMessage('La descripcion no puede ir vacía y debe tener al menos 20 caracteres')
    .isLength({max: 200}).withMessage('La descripcion es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),
    body('precio').isNumeric().withMessage('Selecciona un rango de Precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamiento'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la Propiedad en el mapa'),
    guardar
);

router.get('/propiedades/agregar-imagen/:id', 
    protegerRuta, 
    agregarImagen
);
router.post('/propiedades/agregar-imagen/:id', 
    protegerRuta, 
    upload.single('imagen'), 
    almacenarImagen
);//para subir más imagenes upload.array('imagen',3)

router.get('/propiedades/editar/:id', 
    protegerRuta, 
    editar
);
router.post('/propiedades/editar/:id', 
    protegerRuta,
    body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
    body('descripcion')
    .notEmpty().withMessage('La descripcion del anuncio es obligatoria')
    // .isLength({min: 20}).withMessage('La descripcion no puede ir vacía y debe tener al menos 20 caracteres')
    .isLength({max: 200}).withMessage('La descripcion es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),
    body('precio').isNumeric().withMessage('Selecciona un rango de Precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamiento'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la Propiedad en el mapa'),
    guardarCambios
);

router.post('/propiedades/eliminar/:id', //no usamos delete acá porque lo hicimos con el metodo del formulario POST
    protegerRuta, 
    eliminar
);

router.put('/propiedades/:id', //put o patch para modificar un registro, lo llamamos con un boton con javascript por eso usamos put 
    protegerRuta,
    cambiarEstado
)

//Area Publica
router.get('/propiedad/:id', 
    identificarUsuario,
    mostrarPropiedad
);

// Almacenar los mensajes
router.post('/propiedad/:id',
    identificarUsuario,
    body('mensaje').isLength({min: 20}).withMessage('El Mensaje no puede ir vacio o es muy corto'),
    enviarMensaje
)

router.get('/mensajes/:id', 
    protegerRuta,
    verMensajes
)

export default router;