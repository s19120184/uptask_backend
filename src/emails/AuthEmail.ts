import { transporter } from "../config/nodemailer"
import { IUser } from "../models/User"

interface IEmail{
    email:string;
    name:string;
    token:string;
}

export class AuthEmail{
    static sendConfirmationEmail= async( user :IEmail)=>{
        await transporter.sendMail({
            from:'Uptask <admin@uptask.com>',
            to:user.email,
            subject:'uptask - Confirma tu cuenta',
            text: "Uptask - Confirma tu cuenta ",
            html: `<p>Hola ${user.name}, has creado tu cuenta en Uptask ya casi esta todo listo , solo debes confirmar tu cuenta</p>
            <p>Visita el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/confirm-account" >Confirmar Cuenta</a>
            <p>E ingresa el codigo: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>
            `
        })
    }

    static sendPasswordResetToken= async( user :IEmail)=>{
        await transporter.sendMail({
            from:'Uptask <admin@uptask.com>',
            to:user.email,
            subject:'uptask - Restablece tu password',
            text: "Uptask - Restablece tu password ",
            html: `<p>Hola ${user.name},Has solicitado restablecer tu password.</p>
            <p>Visita el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/new-password" >Restablecer password</a>
            <p>E ingresa el codigo: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>
            `
        })
    }
}