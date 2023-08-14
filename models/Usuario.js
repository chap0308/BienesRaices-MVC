import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../config/db.js'


const Usuario = db.define('usuarios', {//este es el nombre que le dará en la base de datos
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
},{
    //Hashear password
    hooks: {
        beforeCreate: async (usuario) => {
            const salt = await bcrypt.genSalt(10);//cantidad de caracteres del hasheo
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    },
    scopes:{//esto va a quitar todos los campos para que no se muestren en la consola(es importante quitar estos datos)
        eliminarPassword: {
            attributes: {
                exclude: ['password','token','confirmado','createdAt','updatedAt']
            }
        }
    }
})

Usuario.prototype.verificarPassword = function(password){//importante colocar en function() y no en arrow function
    return bcrypt.compareSync(password, this.password);
}

export default Usuario;