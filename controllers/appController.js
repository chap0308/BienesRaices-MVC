import { Sequelize } from 'sequelize'
import { Precio, Categoria, Propiedad } from '../models/index.js'

const inicio = async (req, res) => {
    let valor=true;
    if(req.usuario==null){
        valor=false;
    }

    const [ categorias, precios, casas, departamentos ] = await Promise.all([//los resultados en el array son por orden
        Categoria.findAll({raw: true}),//te muestra los datos de una manera más clara
        Precio.findAll({raw: true}),
        Propiedad.findAll({
            limit: 3,
            where: { 
                categoriaId: 1
            },
            include: [//incluye los datos de la tabla precio que coincida con el id
                {
                    model: Precio, 
                    as: 'precio'
                }
            ], 
            order: [
                ['createdAt', 'DESC']
            ]
        }),
        Propiedad.findAll({
            limit: 3,
            where: { 
                categoriaId: 2
            },
            include: [
                {
                    model: Precio, 
                    as: 'precio'
                }
            ], 
            order: [
                ['createdAt', 'DESC']
            ]
        })
    ])
    
    const casasP= casas.filter(casa => casa.publicado==1);

    const departamentosP= departamentos.filter(departamento => departamento.publicado==1)

    res.render('inicio', {
        pagina: 'Inicio',
        categorias,
        precios,
        casasP,
        departamentosP,
        csrfToken: req.csrfToken(),//esto es por el formulario de la busqueda que está en el header_app
        valor
    })
}

const categoria = async (req, res) => {
    let valor=true;
    if(req.usuario==null){
        valor=false;
    }

    const { id } = req.params

    const expresion = /^[1-9]$/

    if(!expresion.test( id)) {//con esto comprobamos que exista la variable y que tenga las condiciones de la expresion regular
        return res.redirect('/404')
    }

    // Comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id)
    if(!categoria) {
        return res.redirect('/404')
    }

    // Obtener las propiedades de la categoria
    const propiedades = await Propiedad.findAll({
        where: {
            categoriaId: id
        }, 
        include: [
            { model: Precio, as: 'precio'}
        ]
    })
    const propiedadesC= propiedades.filter(propiedad => propiedad.publicado==1);

    res.render('categoria', {
        pagina: `${categoria.nombre}s en Venta`,
        propiedadesC,
        csrfToken: req.csrfToken(),//esto es por el formulario de la busqueda que está en el header_app
        valor
    })
}

const noEncontrado = async (req, res) => {
    let valor=true;
    if(req.usuario==null){
        valor=false;
    }

    res.render('404', {
        pagina: 'No Encontrada',
        csrfToken: req.csrfToken(),//esto es por el formulario de la busqueda que está en el header_app
        valor
    })
}

const buscador = async (req, res) => {
    const { termino } = req.body

    // Validar que termino no este vacio ni que contenga espacios
    if(!termino.trim()) {
        return res.redirect('back')//te redirecciona a la pagina anterior
    }

    // Consultar las propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            titulo: {
                [Sequelize.Op.like] : '%' + termino + '%'//buscador(IMPORTAR EL SEQUILZE), no se puede usar el ``, solo la antigua forma
            }
        },
        include: [
            { model: Precio, as: 'precio'}
        ]
    })

    const propiedadesB= propiedades.filter(propiedad => propiedad.publicado==1);

    res.render('busqueda', {
        pagina: 'Resultados de la Búsqueda',
        propiedadesB,
        csrfToken: req.csrfToken()//esto es por el formulario de la busqueda que está en el header_app
    })
}

export {
    inicio,
    categoria,
    noEncontrado,
    buscador
}