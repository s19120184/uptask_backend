"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAuthorization = exports.taskBelogsToProject = exports.taskExists = void 0;
const Task_1 = __importDefault(require("../models/Task"));
async function taskExists(req, res, next) {
    try {
        const { taskId } = req.params;
        const task = await Task_1.default.findById(taskId);
        if (!task) {
            const error = new Error(`Task not found: ${taskId}`);
            return res.status(404).json({ error: error.message });
        }
        req.task = task; //ahora podemos asignar los datos del task para utilizar esos datos en el request
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Hubo un error" });
    }
}
exports.taskExists = taskExists;
function taskBelogsToProject(req, res, next) {
    //verificamos que la tarea si pertenesca al projecto 
    if (req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error(`Accion no valida`);
        return res.status(400).json({ message: error.message });
    }
    next();
}
exports.taskBelogsToProject = taskBelogsToProject;
function hasAuthorization(req, res, next) {
    //verificamos si el usuario es distinto manager 
    if (req.user.id.toString() !== req.project.manager.toString()) {
        const error = new Error(`Accion no valida`);
        return res.status(400).json({ message: error.message });
    }
    next();
}
exports.hasAuthorization = hasAuthorization;
//# sourceMappingURL=task.js.map