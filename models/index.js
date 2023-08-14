import Propiedad from "./Propiedad.js";
import Precio from "./Precio.js";
import Categoria from "./Categoria.js";
import Usuario from "./Usuario.js";
import Mensaje from "./Mensaje.js";

// Precio.hasOne(Propiedad)//tambien hace lo mismo que belongsTo, pero es diferente el orden(RELACION DE 1 A 1)
Propiedad.belongsTo(Precio, {foreignKey: 'precioId'})//es opcional colocar el foreignKey
Propiedad.belongsTo(Categoria, {foreignKey: 'categoriaId'})
Propiedad.belongsTo(Usuario, {foreignKey: 'usuarioId'})
Propiedad.hasMany(Mensaje, { foreignKey: 'propiedadId'} )

// Categoria.hasMany(Propiedad, {foreignKey: 'precioId'})

Mensaje.belongsTo(Propiedad, { foreignKey: 'propiedadId'})
Mensaje.belongsTo(Usuario, { foreignKey: 'usuarioId'})


export {
    Propiedad,
    Precio,
    Categoria,
    Usuario,
    Mensaje
}