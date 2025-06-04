"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const Task_1 = __importDefault(require("../models/Task"));
class TaskController {
    static createTask = async (req, res) => {
        try {
            const task = new Task_1.default(req.body);
            task.project = req.project.id;
            req.project.tasks.push(task.id);
            // await task.save()
            // await req.project.save()
            //evitamos los dos  await y guardamos de una sola vez
            await Promise.allSettled([task.save(), req.project.save()]);
            res.json("Tarea creada Correctamente");
        }
        catch (error) {
            res.status(500).json({ message: "Hubo un error: " });
        }
    };
    static getProjecTask = async (req, res) => {
        try {
            //el .find es como hacer una consulta con un where
            const task = await Task_1.default.find({ project: req.project.id }).populate("project"); //populate para hace una consulta tipo join en este caso la reacionque tenemos en nustro schema
            res.json(task);
        }
        catch (error) {
            res.status(500).json({ message: "Hubo un error: " });
        }
    };
    static getTaskById = async (req, res) => {
        try {
            const task = await Task_1.default.findById(req.task.id)
                .populate({ path: "completedBy.user", select: "id name email" })
                .populate({ path: "notes", populate: { path: "createdBy", select: 'id name email' } });
            res.json(task);
        }
        catch (error) {
            res.status(500).json({ message: "Hubo un error: " });
        }
    };
    static updateTask = async (req, res) => {
        try {
            //reasignamos los valores que vienen el req  y posteriormete guardamos la tarea con los nuevos  valores
            req.task.name = req.body.name;
            req.task.description = req.body.description;
            await req.task.save();
            res.json("Tasks updated successfully");
        }
        catch (error) {
            res.status(500).json({ message: "Hubo un error: " });
        }
    };
    static deleteTask = async (req, res) => {
        try {
            //actualizamos las tares del projecto nos traemos tomas menos la que se va elimnar
            req.project.tasks = req.project.tasks.filter((task) => task.toString() !== req.task.id.toString());
            //se elimina  la tarea posteriormente el projecto se guarda con la acutalizacion de las tareas
            await Promise.allSettled([req.task.deleteOne(), req.project.save()]);
            res.json("Tasks delete successfully");
        }
        catch (error) {
            res.status(500).json({ message: "Hubo un error: " });
        }
    };
    static uptadeStatusTask = async (req, res) => {
        try {
            const { status } = req.body;
            req.task.status = status;
            const data = {
                user: req.user.id,
                status
            };
            req.task.completedBy.push(data);
            await req.task.save();
            res.json("tarea Actualizada");
        }
        catch (error) {
            res.status(500).json({ message: "Hubo un error: " });
        }
    };
}
exports.TaskController = TaskController;
//# sourceMappingURL=TaskController.js.map