"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMemberController = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const User_1 = __importDefault(require("../models/User"));
class TeamMemberController {
    static findMeberByEmail = async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User_1.default.findOne({ email }).select('id email name');
            if (!user) {
                const error = new Error("Usuario no encontrado");
                return res.status(404).json({ error: error.message });
            }
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ message: "Hubo un error: " });
        }
    };
    static getProjectMembers = async (req, res) => {
        const project = await Project_1.default.findById(req.project.id).populate({
            path: 'team',
            select: 'id email name'
        });
        res.json(project.team);
    };
    static addMemberById = async (req, res) => {
        try {
            const { id } = req.body;
            const user = await User_1.default.findById(id).select('id');
            if (!user) {
                const error = new Error('Usuarion no encontrado');
                return res.status(404).json({ error: error.message });
            }
            if (req.project.team.some(team => team.toString() === user.id.toString())) {
                const error = new Error('El Usuario ya forma parte del equipo');
                return res.status(409).json({ error: error.message });
            }
            req.project.team.push(user.id);
            await req.project.save();
            res.json('Usuario agregado correctamente');
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static removeMemberById = async (req, res) => {
        const { userId } = req.params;
        if (!req.project.team.some(team => team.toString() === userId)) {
            const error = new Error('El usuario no existe en el proyecto');
            return res.status(409).json({ error: error.message });
        }
        req.project.team = req.project.team.filter(team => team.toString() !== userId);
        await req.project.save();
        res.json("El usuario esta fuera del equipo");
    };
}
exports.TeamMemberController = TeamMemberController;
//# sourceMappingURL=TeamController.js.map