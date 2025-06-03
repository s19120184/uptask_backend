import { NextFunction  ,Request , Response} from "express";
import User, { IUser } from "../models/User";
import { generateToken } from "../utils/token";
import Token from "../models/Token";
import { AuthEmail } from "../emails/AuthEmail";
import jwt from 'jsonwebtoken';


declare global{
    namespace Express{
        interface Request{
            user: IUser
        }
    }
}


export async function UserExists( req: Request, res: Response, next: NextFunction){

    try {
        const { email }=req.body;
        const task = await User.findOne({email: email});
        if(task){
            const error = new Error(`Este correo ya esta registrado: ${email}`)
            return res.status(409).json({error: error.message})
        }
       // req.user = task//ahora podemos asignar los datos del task para utilizar esos datos en el request
        next()
        
    } catch (error) {
        res.status(500).json({error: "Hubo un error"})
        
    }
}

export async function UserLoginExist( req: Request, res: Response, next: NextFunction){

    try {
        const { email }=req.body;
        const user = await User.findOne({email: email});
        if(!user){
            const error = new Error(`Este correo no esta registrado: ${email}`)
            return res.status(404).json({error: error.message})
        }

        if(!user.confirmed){
            const token = new Token()
            token.user =user.id
            token.token = generateToken()

            //enviamos un nuvo token al usuario
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token:token.token
            })

            const error = new Error(`Aun no has confirmado tu cuenta , hemos enviado un e-mail de confirmacion`)
            return res.status(401).json({error: error.message})
        }

        req.user = user//ahora podemos asignar los datos del task para utilizar esos datos en el request
        next()
        
    } catch (error) {
        res.status(500).json({error: "Hubo un error"})
        
    }
}

export const authenticate= async(req:Request, res:Response, next:NextFunction)=>{
      const bearer= req.headers.authorization 


      if(!bearer) {
        const error = new Error("No autorizado")
        return res.status(401).json({error: error.message})
      }

      const[,token] = bearer.split(' ')

      try {
      const decoded= jwt.verify(token, process.env.JWT_SECRET)

      if(typeof decoded === 'object' && decoded.id) {
        const user = await User.findById(decoded.id).select('_id name email')
       
        if(user) {
            req.user = user
            next()
        }else{
            res.status(500).json({error: "Token no valido"})
        }
      }
     
        
      } catch (error) {
        res.status(500).json({error: "Token no valido"})
      }

}