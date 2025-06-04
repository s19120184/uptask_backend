import { transporter } from "../../config/nodemailer";

type EmailType = {
  name: string;
  email: string;
  token: string;
};

export class AuthEmailGoogle {
  static sendConfirmationEmail = async (user: EmailType) => {
    const email = await transporter.sendMail({
      from: "Uptask <admin@Uptask.com >",
      to: user.email,
      subject: "Uptask - Confirma tu cuenta",
      html: `
            <p>Hola ${user.name}, has creado tu cuenta en Uptask ya casi esta todo listo , solo debes confirmar tu cuenta</p>
            <p>Visita el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/confirm-account" >Confirmar Cuenta</a>
            <p>E ingresa el codigo: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>
            `
    });


  };

  static sendPasswordResetToken= async( user :EmailType)=>{
    await transporter.sendMail({
        from:'Uptask <admin@Uptask.com>',
        to:user.email,
        subject:'Uptask - Restablece tu password',
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