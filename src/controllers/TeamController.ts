import Project from "../models/Project";
import User from "../models/User";
import type { Request, Response } from "express";

export class TeamMemberController {
  static findMeberByEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email }).select('id email name');
      if(!user){
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({error: error.message});
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Hubo un error: " });
    }
  };

  static getProjectMembers= async (req: Request, res: Response) => {
      const project =await Project.findById(req.project.id).populate(
        {
            path: 'team',
            select:'id email name'
        }
      )
      res.json(project.team)

  }

  static addMemberById= async (req: Request, res: Response) => {
     try {
        const {id}= req.body
        const user = await User.findById(id).select('id');
        if(!user){
            const error = new Error('Usuarion no encontrado')
            return res.status(404).json({error: error.message})
        }

        if (req.project.team.some(team => team.toString() === user.id.toString())){
            const error = new Error('El Usuario ya forma parte del equipo')
            return res.status(409).json({error: error.message})
             
        }

        req.project.team.push(user.id)
        await req.project.save()
        res.json('Usuario agregado correctamente')

    } catch (error) {
        res.status(500).json({error: "Hubo un error"});
     }
  }
     static removeMemberById= async (req: Request, res: Response) =>{
            const {userId}= req.params

            if(!req.project.team.some(team => team.toString() === userId)){
                const error = new Error('El usuario no existe en el proyecto')
                return res.status(409).json({error: error.message})
            }

            req.project.team= req.project.team.filter(team => team.toString() !== userId)
            await req.project.save()
            res.json("El usuario esta fuera del equipo")

     }

}
