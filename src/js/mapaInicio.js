(function(){
    const lat = -12.0596766;
    const lng = -77.0377486;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 13);

    let markers = new L.FeatureGroup().addTo(mapa)

    let propiedades = [];

    // Filtros
    const filtros = {
        categoria: '',
        precio: ''
    }

    const categoriasSelect = document.querySelector('#categorias');
    const preciosSelect = document.querySelector('#precios');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa)

    // Filtrado de Categorias y precios
    categoriasSelect.addEventListener('change', e => {
        filtros.categoria = +e.target.value//el + convierte el string en numero
        filtrarPropiedades();
    })

    preciosSelect.addEventListener('change', e => {
        filtros.precio = +e.target.value
        filtrarPropiedades();
    })

    const obtenerPropiedades = async () => {
        try {
            const url = '/api/propiedades'
            const respuesta = await fetch(url)
            propiedades = await respuesta.json()
            mostrarPropiedades(propiedades)
        } catch (error) {
            console.log(error)
        }
    }

    const mostrarPropiedades = propiedades => {

        // Limpiar los markers previos(Importante)
        markers.clearLayers()

        propiedades.forEach(propiedad => {
            if(propiedad.publicado){
                // Agregar los pines
                const marker = new L.marker([propiedad?.lat, propiedad?.lng ], {//USAMOS el ? para que verifique si existe o no
                    autoPan: true
                })
                .addTo(mapa)
                .bindPopup(`
                    <p class="text-indigo-600 font-bold">${propiedad.categoria.nombre}</p>
                    <h1 class="text-xl font-extrabold uppercase my-2">${propiedad?.titulo}</h1>
                    <img src="/uploads/${propiedad?.imagen}" alt="Imagen de la propiedad ${propiedad.titulo}">
                    <p class="text-gray-600 font-bold">${propiedad.precio.nombre}</p>
                    <a href="/propiedad/${propiedad.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase color-boton">Ver Propiedad</a>
                `)
                markers.addLayer(marker)//limpia los criterios de busqueda que coincidan con la persona
            }
            
        })
    }

    const filtrarPropiedades = () => {
        //IMPORTANTE:
        const resultado = propiedades.filter(filtrarPublicado).filter( filtrarCategoria ).filter( filtrarPrecio )//"chaining" o encademiento: se usa para agregar más metodos en una misma variable
        mostrarPropiedades(resultado)
        // console.log(resultado)
    }

    const filtrarPublicado = propiedad => propiedad.publicado==1

    const filtrarCategoria = propiedad => filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad
    
    const filtrarPrecio = propiedad => filtros.precio ? propiedad.precioId === filtros.precio : propiedad


    obtenerPropiedades()

})()