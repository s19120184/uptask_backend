import type { Request, Response } from "express";
import Proyect from "../models/Project";
import Task from "../models/Task";

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body);
      task.project = req.project.id;
      req.project.tasks.push(task.id);
      // await task.save()
      // await req.project.save()
      //evitamos los dos  await y guardamos de una sola vez
      await Promise.allSettled([task.save(), req.project.save()]);
      res.send("Tarea creada Correctamente");
    } catch (error) {
      res.status(500).json({ message: "Hubo un error: " });
    }
  };

  static getProjecTask = async (req: Request, res: Response) => {
    try {
      //el .find es como hacer una consulta con un where
      const task = await Task.find({ project: req.project.id }).populate(
        "project"
      ); //populate para hace una consulta tipo join en este caso la reacionque tenemos en nustro schema
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Hubo un error: " });
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    try {
      const task = await Task.findById(req.task.id)
                          .populate({path:"completedBy.user", select:"id name email"})
                          .populate({path:"notes" , populate:{path:"createdBy", select:'id name email'}})
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Hubo un error: " });
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    try {
      //reasignamos los valores que vienen el req  y posteriormete guardamos la tarea con los nuevos  valores
      req.task.name = req.body.name;
      req.task.description = req.body.description;
      await req.task.save();

      res.send("Tasks updated successfully");
    } catch (error) {
      res.status(500).json({ message: "Hubo un error: " });
    }
  };

  static deleteTask = async (req: Request, res: Response) => {
    try {
      //actualizamos las tares del projecto nos traemos tomas menos la que se va elimnar
      req.project.tasks = req.project.tasks.filter(
        (task) => task.toString() !== req.task.id.toString()
      );
      //se elimina  la tarea posteriormente el projecto se guarda con la acutalizacion de las tareas
      await Promise.allSettled([req.task.deleteOne(), req.project.save()]);
      res.send("Tasks delete successfully");
    } catch (error) {
      res.status(500).json({ message: "Hubo un error: " });
    }
  };

  static uptadeStatusTask = async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      req.task.status = status;

      const data={
        user:req.user.id,
        status
      }

      req.task.completedBy.push(data);


      await req.task.save();
      res.send("tarea Actualizada");
    } catch (error) {
      res.status(500).json({ message: "Hubo un error: " });
    }
  };
}
