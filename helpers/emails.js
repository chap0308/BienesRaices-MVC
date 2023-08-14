import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos;

    //Enviar el email
    await transport.sendMail({
        from: "BienesRaices@correo.com",
        to: email,
        subject: "Confirma tu cuenta en BienesRaices.com",
        text: "Confirma tu cuenta en BienesRaices.com",
        html: `
        <p>Hola: ${nombre}, comprueba tu cuenta en BienesRaices.com</p>
        <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace: 
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a></p>

        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    })
    // console.log(datos);
}

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos;

    //Enviar el email
    await transport.sendMail({
        from: "BienesRaices@correo.com",
        to: email,
        subject: "Restablece tu contraseña en BienesRaices.com",
        text: "Restablece tu contraseña en BienesRaices.com",
        html: `
        <p>Hola: ${nombre}, has solicitado restablecer tu contraseña en BienesRaices.com</p>
        <p>Ingresa al siguiente enlace para generar una nueva contraseña:
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Reestablecer Password</a></p>

        <p>Si tu no solicitaste el cambio de contraseña, puedes ignorar este mensaje</p>
        `
    })
}

export{
    emailRegistro,
    emailOlvidePassword
}