import nodemailer from 'nodemailer';
import { Resend } from "resend";



const emailRegistro = async (datos) => {

    // const resend = new Resend("re_T6qqPYMi_Hi6bo1wpTznHhn6zQB3cXXD7");

    const { email, nombre, token } = datos;
    console.log(datos);
    
    // const data = await resend.emails.send({
    //     from: "BienesRaices@resend.dev",
    //     to: [email],
    //     subject: "Confirma tu cuenta en BienesRaices.com",
    //     html: `
    //     <p>Hola: ${nombre}, comprueba tu cuenta en BienesRaices.com</p>
    //     <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace: 
    //     <a href="${process.env.BACKEND_URL}/auth/confirmar/${token}">Confirmar Cuenta</a></p>

    //     <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
    //     `
    // });

    // console.log(data);

    try {
        const transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        
        
    
        //Enviar el email
        const data = await transport.sendMail({
            from: "XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            to: email,
            subject: "Confirma tu cuenta en BienesRaices.com",
            text: "Confirma tu cuenta en BienesRaices.com",
            html: `
            <p>Hola: ${nombre}, comprueba tu cuenta en BienesRaices.com</p>
            <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace: 
            <a href="${process.env.BACKEND_URL}/auth/confirmar/${token}">Confirmar Cuenta</a></p>
    
            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
            `
        })
        console.log(data)
    } catch (error) {
        console.log(error);
    }
    

}
const emailOlvidePassword = async (datos) => {

    const resend = new Resend("re_T6qqPYMi_Hi6bo1wpTznHhn6zQB3cXXD7");

    const { email, nombre, token } = datos;

    await resend.emails.send({
        from: "BienesRaices@correo.com",
        to: [email],
        subject: "Restablece tu contraseña en BienesRaices.com",
        html: `
        <p>Hola: ${nombre}, has solicitado restablecer tu contraseña en BienesRaices.com</p>
        <p>Ingresa al siguiente enlace para generar una nueva contraseña:
        <a href="${process.env.BACKEND_URL}/auth/olvide-password/${token}">Reestablecer Password</a></p>

        <p>Si tu no solicitaste el cambio de contraseña, puedes ignorar este mensaje</p>
        `
    });

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    //Enviar el email
    await transport.sendMail({
        from: "BienesRaices@correo.com",
        to: email,
        subject: "Restablece tu contraseña en BienesRaices.com",
        text: "Restablece tu contraseña en BienesRaices.com",
        html: `
        <p>Hola: ${nombre}, has solicitado restablecer tu contraseña en BienesRaices.com</p>
        <p>Ingresa al siguiente enlace para generar una nueva contraseña:
        <a href="${process.env.BACKEND_URL}/auth/olvide-password/${token}">Reestablecer Password</a></p>

        <p>Si tu no solicitaste el cambio de contraseña, puedes ignorar este mensaje</p>
        `
    })
}

export{
    emailRegistro,
    emailOlvidePassword
}