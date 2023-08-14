import path from 'path';

export default{
    mode: 'development',
    entry: {
        mapa: './src/js/mapa.js',
        agregarImagen: './src/js/agregarImagen.js',//si colocamos uno nuevo, tenemos que reiniciar la terminal (ctrl C y npm run dev)
        mapaInicio: './src/js/mapaInicio.js',
        cambiarEstado: './src/js/cambiarEstado.js'
    },
    output: {
        filename:'[name].js',
        path: path.resolve('public/js')
    }
}