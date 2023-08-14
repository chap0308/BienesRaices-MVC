import { Dropzone } from 'dropzone';

// const token = document.querySelector('meta[name="csrf-token"]').content;//tambien funciona
//console.log(console.log(document.querySelector('meta[name="csrf-token"]').content))

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
// console.log(token)


Dropzone.options.imagen={
    //NORMALMENTE PARA CAMBIAR EL MENSAJE DE LAS ALERTAS PREDETERMINADAS DE INGLES A ESPAÑOL SE USAN LOS KEYS QUE COMIENZAN EN "dict"
    dictDefaultMessage: "Selecciona o arrastra tu imagen aquí",
    acceptedFiles: ".jpg,.png,.jpeg",
    maxFilesize: 5,//5 MB
    maxFiles: 1,
    parallelUploads: 1,//misma cantidad de maxFiles
    //IMPORTANTE:
    autoProcessQueue: false,//con esto evitamos que el archivo se suba automaticamente. Pero en algunos casos puede ser true, solo si quieres que se suba las imagenes automaticamente, sin la necesidad de dar click a un boton
    //--------------------------------
    addRemoveLinks: true,
    dictRemoveFile: "Eliminar archivo",
    dictMaxFilesExceeded: "Solo puedes subir un archivo",
    dictFileTooBig: 'El archivo debe pesar menos de 5 MB',
    //Añadiendo Protección CSRF a Dropzone
    headers:{
        'CSRF-Token': token
    },
    paramName: "imagen",
    init: function() {
        const dropzone = this
        const btnPublicar = document.querySelector('#publicar')

        btnPublicar.addEventListener('click', function() {
            dropzone.processQueue()
        })

        dropzone.on('queuecomplete', function() {
            if(dropzone.getActiveFiles().length == 0) {
                window.location.href = '/mis-propiedades'
            }
        })

    }
}