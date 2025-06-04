"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const Project_1 = __importDefault(require("../models/Project"));
class ProjectController {
    static createProject = async (req, res) => {
        const project = new Project_1.default(req.body);
        //asignar manager
        project.manager = req.user.id;
        try {
            //usamos las funciones del ORM mongoose
            await project.save();
            res.json("Projecto creado correctamente");
        }
        catch (error) {
            (error);
        }
    };
    static getAllProjects = async (req, res) => {
        try {
            //solo los projectos del usuario autenticado usando $or
            const projects = await Project_1.default.find({
                $or: [
                    { manager: { $in: req.user.id } },
                    { team: { $in: req.user.id } } //o si eres parte del equipo
                ]
            });
            res.json(projects);
        }
        catch (error) {
            (error);
        }
    };
    static getProyectById = async (req, res) => {
        const { id } = req.params;
        try {
            //obtener el proyecto por medio del id
            const project = await Project_1.default.findById(id).populate("tasks");
            if (!project) {
                const error = new Error("Project not found");
                return res.status(404).json({ error: error.message });
            }
            if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error("Accion no valida");
                return res.status(404).json({ error: error.message });
            }
            res.json(project);
        }
        catch (error) {
            (error);
        }
    };
    static updateProject = async (req, res) => {
        const { id } = req.params;
        try {
            req.project.projectName = req.body.projectName;
            req.project.clientName = req.body.clientName;
            req.project.description = req.body.description;
            await req.project.save();
            res.json("Proyecto actalizado");
        }
        catch (error) {
            (error);
        }
    };
    static deleteProject = async (req, res) => {
        try {
            //eliminamos el projecto
            await req.project.deleteOne();
            res.json("Proyecto eliminado");
        }
        catch (error) {
            (error);
        }
    };
}
exports.ProjectController = ProjectController;
//# sourceMappingURL=ProyectController.js.map