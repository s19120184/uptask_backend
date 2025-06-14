"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteController = void 0;
const Note_1 = __importDefault(require("../models/Note"));
class NoteController {
    //podemos agregar generics al request
    static createNote = async (req, res) => {
        const { content } = req.body;
        const note = new Note_1.default();
        note.content = content;
        note.createdBy = req.user.id;
        note.task = req.task.id;
        req.task.notes.push(note.id);
        console.log(note);
        try {
            //gurdamos la actualizacion de la tarea y la nueva nota
            await Promise.allSettled([req.task.save(), note.save()]);
            res.json("Nota creada correctamente");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static getTaskNotes = async (req, res) => {
        try {
            const notes = await Note_1.default.find({ task: req.task.id });
            res.json(notes);
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static deleteNote = async (req, res) => {
        const { noteId } = req.params;
        const note = await Note_1.default.findById(noteId);
        if (!note) {
            const error = new Error('Nota no encontrada');
            return res.status(404).json({ error: error.message });
        }
        if (note.createdBy.toString() !== req.user.id.toString()) {
            const error = new Error('Accion no valida');
            return res.status(401).json({ error: error.message });
        }
        //firltramos las notas exepto la que se va eliminar
        req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString());
        try {
            await Promise.allSettled([req.task.save(), note.deleteOne()]);
            res.json('Nota eliminada');
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
}
exports.NoteController = NoteController;
//# sourceMappingURL=NoteController.js.map