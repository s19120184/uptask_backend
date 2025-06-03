import type { Request, Response , NextFunction} from 'express'
import Proyect, { ITask } from '../models/Task'
import Task from '../models/Task'

//reincribimos el request para poder tener los datos del task en el request
declare global{
    namespace Express{
        interface Request{
            task: ITask 
        }
    }
}

export async function taskExists( req: Request, res: Response, next: NextFunction){

    try {
        const {taskId }= req.params
        const task = await Task.findById(taskId)
        if(!task){
            const error = new Error(`Task not found: ${taskId}`)
            return res.status(404).json({error: error.message})
        }
        req.task = task//ahora podemos asignar los datos del task para utilizar esos datos en el request
        next()
        
    } catch (error) {
        res.status(500).json({error: "Hubo un error"})
        
    }
}

export function taskBelogsToProject(req: Request, res: Response, next: NextFunction) {
      //verificamos que la tarea si pertenesca al projecto 
      if(req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error(`Accion no valida`)
        return res.status(400).json({message: error.message})
    }
    next()
}

export function hasAuthorization(req: Request, res: Response, next: NextFunction) {
    //verificamos si el usuario es distinto manager 
    if(req.user.id.toString() !== req.project.manager.toString()) {
      const error = new Error(`Accion no valida`)
      return res.status(400).json({message: error.message})
  }
  next()
}