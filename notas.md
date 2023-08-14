# IMPORTANTE:
    los datos del formulario se quedan guardados en la página, por eso debes usar validaciones por si tienes algun error. Más detallado en usuarioController: linea 253
/////////////////////////////////////////////////
# Tener en cuenta los metodos render:
    res.render('templates/mensaje',{
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos enviado un Email de confirmacion, presiona en el enlace'
    });

# Aunque veas que la url de tu pagina es diferente a la ruta del render, no significa que está mal, el render solo muestra el contenido del archivo con sus variables. Y si lo encuentras de la siguiente forma:
     if(!resultado.isEmpty()){//si hay errores:
        //Errores
        return res.render('auth/reset-password',{
            pagina: 'Reestablece tu Password',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    }
# el return es normal despues de cada if, para evitar el else así que hacen lo mismo. Pero debes colocarlo de esa manera siempre. Además, casi siempre el primer ejemplo va despues de este segundo.

//////////////////////////////////////////////////////

# // Leer QueryString(es diferente al req.param) y renombrar una variable (IMPORTANTE)
    const { pagina: paginaActual } = req.query;//acá renombramos la variable pagina que sale en el query a paginaActual

///////////////////////////////////////////////////////

    el atributo name de las etiquetas son los valores de req.body en el controlador
    name="propiedad"
    const {propiedad} = req.body

//////////////////////////////////////////////////////
# Diferencia entre render y redirect: En resumen, redirect se utiliza para redirigir al cliente a una nueva URL, mientras que render se utiliza para generar y enviar una respuesta HTML completa al cliente basada en una plantilla y datos proporcionados.
    redirect('/mis-propiedades')

    render('propiedades',{
        pagina: "Inicio"
    })