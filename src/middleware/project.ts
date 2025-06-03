import type { Request, Response , NextFunction} from 'express'
import Proyect, { IProject } from '../models/Project'

//reincribimos el request para poder tener los datos del project en el 
declare global{
    namespace Express{
        interface Request{
            project: IProject
        }
    }
}

export async function validateProjectExist( req: Request, res: Response, next: NextFunction){

    try {
        const {projectId }= req.params
        const project = await Proyect.findById(projectId)
        if(!project){
            const error = new Error(`Project not found: ${projectId}`)
            return res.status(404).json({error: error.message})
        }
        req.project = project//ahora podemos asignar los datos del project para utilizar esos datos en el request
        next()
        
    } catch (error) {
        res.status(500).json({error: "Hubo un error"})
        
    }
}




