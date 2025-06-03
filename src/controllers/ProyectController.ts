import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);

    //asignar manager
    project.manager = req.user.id;

    try {
      //usamos las funciones del ORM mongoose
      await project.save();
      res.json("Projecto creado correctamente");

    } catch (error) {
      console.log(error);
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {

      //solo los projectos del usuario autenticado usando $or
      const projects = await Project.find({
        $or:[
          {manager:{$in: req.user.id}},
          {team: {$in:req.user.id}} //o si eres parte del equipo
        ]
      });
      res.json(projects);
    } catch (error) {
      console.log(error);
    }
  };

  static getProyectById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      //obtener el proyecto por medio del id
      const project = await Project.findById(id).populate("tasks");
      if (!project) {
        const error = new Error("Project not found");
        return res.status(404).json({ error: error.message });
      }

      if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
        const error = new Error("Accion no valida");
        return res.status(404).json({ error: error.message });
      }


      res.json(project);
    } catch (error) {
      console.log(error);
    }
  };

  static updateProject = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {

      req.project.projectName = req.body.projectName;
      req.project.clientName = req.body.clientName;
      req.project.description = req.body.description;

      await req.project.save();
      res.json("Proyecto actalizado");
    } catch (error) {
      console.log(error);
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    try {

    

      //eliminamos el projecto
      await req.project.deleteOne();
      res.json("Proyecto eliminado");
    } catch (error) {
      console.log(error);
    }
  };
}
