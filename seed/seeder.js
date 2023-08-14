import {exit} from "node:process";
import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
import db from "../config/db.js";
import { Categoria, Precio, Usuario } from "../models/index.js";

const importarDatos = async () => {
    try {
        //Autenticar
        await db.authenticate();

        //Generar las columnas
        await db.sync();

        //Insertar los datos
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ]);
        console.log("Datos importados correctamente");
        exit();//acaba la ejecucion correctamente, tambien se puede usar exit(0). Es lo mismo

    } catch (error) {
        console.log(error);
        exit(1);//acaba la ejecucion con error
    }

}

const eliminarDatos = async () => {
    try {
        //Se pueden hacer de esta manera o ...
        // await Promise.all([
        //     Categoria.destroy({where: {}, truncate: true}),//el truncate hace que se borre todos los datos y que la tabla comience desde cero(se reinicia los id)
        //     Precio.destroy({where: {}, truncate: true}),
        // ]);
        //de esta manera tambien
        await db.sync({force: true});
        console.log("Datos eliminados correctamente");
        exit();//acaba la ejecucion correctamente, tambien se puede usar exit(0). Es lo mismo

    } catch (error) {
        console.log(error);
        exit(1);//acaba la ejecucion con error
    }

}



if(process.argv[2] === "-i"){//secccion 14: video 83
    importarDatos();
}

if(process.argv[2] === "-e"){//secccion 14: video 83
    eliminarDatos();
}