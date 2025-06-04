"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProyectController_1 = require("../controllers/ProyectController");
const express_validator_1 = require("express-validator"); //npm i express-validator
const validaton_1 = require("../middleware/validaton");
const TaskController_1 = require("../controllers/TaskController");
const project_1 = require("../middleware/project");
const task_1 = require("../middleware/task");
const user_1 = require("../middleware/user");
const TeamController_1 = require("../controllers/TeamController");
const NoteController_1 = require("../controllers/NoteController");
const router = (0, express_1.Router)();
//para impplemetar authenticate en todos los endpoints
router.use(user_1.authenticate);
router.post("/", 
//implementamos validacion con express-validator
(0, express_validator_1.body)("projectName")
    .notEmpty()
    .withMessage("El Nombre del projecto es obligatorio"), (0, express_validator_1.body)("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente  es obligatorio"), (0, express_validator_1.body)("description")
    .notEmpty()
    .withMessage("La Descripcion del proyecto es obligatorio"), validaton_1.handleInputErrors, ProyectController_1.ProjectController.createProject);
router.get("/", user_1.authenticate, ProyectController_1.ProjectController.getAllProjects);
router.get("/:id", 
//expres-validator tabien tiene validacion de parametros
(0, express_validator_1.param)("id").isMongoId().withMessage("El id no es valido"), validaton_1.handleInputErrors, ProyectController_1.ProjectController.getProyectById);
//nuestros endpoints con el parametro projectId necesitan validar que el proyecto exista esta en una forma para no repetir codigo
router.param("projectId", project_1.validateProjectExist);
router.put("/:projectId", 
//expres-validator tabien tiene validacion de parametros
(0, express_validator_1.param)("projectId").isMongoId().withMessage("El id no es valido"), (0, express_validator_1.body)("projectName")
    .notEmpty()
    .withMessage("El Nombre del projecto es obligatorio"), (0, express_validator_1.body)("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente  es obligatorio"), (0, express_validator_1.body)("description")
    .notEmpty()
    .withMessage("La Descripcion del proyecto es obligatorio"), validaton_1.handleInputErrors, task_1.hasAuthorization, ProyectController_1.ProjectController.updateProject);
router.delete("/:projectId", 
//expres-validator tabien tiene validacion de parametros
(0, express_validator_1.param)("projectId").isMongoId().withMessage("El id no es valido"), validaton_1.handleInputErrors, task_1.hasAuthorization, ProyectController_1.ProjectController.deleteProject);
/**Routes for tasks  */
router.post("/:projectId/tasks", task_1.hasAuthorization, (0, express_validator_1.body)("name").notEmpty().withMessage("El Nombre de la tarea es obligatoria"), (0, express_validator_1.body)("description").notEmpty().withMessage("La Descripcion es obligatoria"), validaton_1.handleInputErrors, TaskController_1.TaskController.createTask);
router.get("/:projectId/tasks/", TaskController_1.TaskController.getProjecTask);
//utilizamos middelware para verificar que la tarea exista y verificar que la tarea pertenece al project
router.param('taskId', task_1.taskExists);
router.param('taskId', task_1.taskBelogsToProject);
router.get("/:projectId/tasks/:taskId", (0, express_validator_1.param)("taskId").isMongoId().withMessage("El id no es valido"), validaton_1.handleInputErrors, TaskController_1.TaskController.getTaskById);
router.put("/:projectId/tasks/:taskId", task_1.hasAuthorization, (0, express_validator_1.param)("taskId").isMongoId().withMessage("El id no es valido"), (0, express_validator_1.body)("name").notEmpty().withMessage("El Nombre de la tarea es obligatoria"), (0, express_validator_1.body)("description").notEmpty().withMessage("La Descripcion es obligatoria"), validaton_1.handleInputErrors, TaskController_1.TaskController.updateTask);
router.delete("/:projectId/tasks/:taskId", task_1.hasAuthorization, (0, express_validator_1.param)("taskId").isMongoId().withMessage("El id no es valido"), validaton_1.handleInputErrors, TaskController_1.TaskController.deleteTask);
router.post("/:projectId/tasks/:taskId/status", (0, express_validator_1.param)('taskId').isMongoId().withMessage("Id no es valido"), (0, express_validator_1.body)('statys').notEmpty().withMessage("El estado es obligatorio"), TaskController_1.TaskController.uptadeStatusTask, validaton_1.handleInputErrors);
/** Routes para colaboradores */
router.post("/:projectId/team/find", (0, express_validator_1.body)('email').isEmail().toLowerCase().withMessage('Email no valido'), validaton_1.handleInputErrors, TeamController_1.TeamMemberController.findMeberByEmail);
router.get('/:projectId/team', TeamController_1.TeamMemberController.getProjectMembers);
router.post('/:projectId/team', (0, express_validator_1.body)('id').isMongoId().withMessage('Id no es valido'), validaton_1.handleInputErrors, TeamController_1.TeamMemberController.addMemberById);
router.delete("/:projectId/team/:userId", (0, express_validator_1.param)('userId').isMongoId().withMessage('Id no es valido'), validaton_1.handleInputErrors, TeamController_1.TeamMemberController.removeMemberById);
/** Routes for Notes */
router.post('/:projectId/tasks/:taskId/notes', (0, express_validator_1.body)('content').notEmpty().withMessage('El Contenido de la nota es obligatorio'), validaton_1.handleInputErrors, NoteController_1.NoteController.createNote);
router.get('/:projectId/tasks/:taskId/notes', NoteController_1.NoteController.getTaskNotes);
router.delete('/:projectId/tasks/:taskId/notes/:noteId', (0, express_validator_1.param)('noteId').isMongoId().withMessage('Id no es valido'), validaton_1.handleInputErrors, NoteController_1.NoteController.deleteNote);
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map