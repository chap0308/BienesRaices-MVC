(function() {
    const cambiarEstadoBotones = document.querySelectorAll('.cambiar-estado')
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')//obtenemos el token

    cambiarEstadoBotones.forEach( boton => {
        boton.addEventListener('click', cambiarEstadoPropiedad)
    } )


    async function cambiarEstadoPropiedad(e) {
        // console.log(e.target.dataset)// data-propiedad-id se vuelve propiedadId
        const { propiedadId: id } = e.target.dataset//renombramos a id
        
        const linkImagen= document.querySelector(`[data-imagen="${id}"]`)
        const botonEditar= document.querySelector(`[data-editar="${id}"]`)
        
        
        // console.log(linkImagen)
        // return

        try {
            const url = `/propiedades/${id}`

            const respuesta = await fetch(url, {
                method: 'PUT',
                headers: {
                    'CSRF-Token': token//asi podemos enviar el token, ya que tenemos la funcion de protegerRuta en esta ruta
                }
            })

            const {resultado} = await respuesta.json()

            if(resultado) {
                if(e.target.classList.contains('bg-yellow-100')) {
                    e.target.classList.add('bg-green-100', 'text-green-800')
                    e.target.classList.remove('bg-yellow-100', 'text-yellow-800')
                    e.target.textContent = 'Publicado'
                    linkImagen.removeAttribute("href");
                    linkImagen.style.cursor = "auto";
                    botonEditar.style.display = "none";
                    
                    
                } else {
                    e.target.classList.remove('bg-green-100', 'text-green-800')
                    e.target.classList.add('bg-yellow-100', 'text-yellow-800')
                    e.target.textContent = 'No Publicado'
                    linkImagen.href = `/propiedades/agregar-imagen/${id}`;
                    linkImagen.style.cursor = "pointer";
                    linkImagen.removeAttribute("onclick");
                    botonEditar.removeAttribute("style");

                }
            }
        } catch (error) {
            console.log(error)
        }
       
    }
})()