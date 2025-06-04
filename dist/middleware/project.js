"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProjectExist = void 0;
const Project_1 = __importDefault(require("../models/Project"));
async function validateProjectExist(req, res, next) {
    try {
        const { projectId } = req.params;
        const project = await Project_1.default.findById(projectId);
        if (!project) {
            const error = new Error(`Project not found: ${projectId}`);
            return res.status(404).json({ error: error.message });
        }
        req.project = project; //ahora podemos asignar los datos del project para utilizar esos datos en el request
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Hubo un error" });
    }
}
exports.validateProjectExist = validateProjectExist;
//# sourceMappingURL=project.js.map