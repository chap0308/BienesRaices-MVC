const esVendedor = (usuarioId, propiedadUsuarioId) => {
    return usuarioId === propiedadUsuarioId
}

const formatearFecha = fecha => {
    const nuevaFecha = new Date(fecha).toISOString().slice(0, 10)//toISOString convierte un objeto a string y slice toma las posiciones de los caracteres y te devuelve esa parte
                                                                //split('T') divide la fecha en dos partes dentro de un array, la primera va a ser hasta que encuentre el valor 'T' y la segunda va a ser lo demás

    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
    }

    return new Date(nuevaFecha).toLocaleDateString('es-ES', opciones)//para formatear la fecha
    
}

export {
    esVendedor,
    formatearFecha
}