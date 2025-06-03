import { Router } from "express";
import { ProjectController } from "../controllers/ProyectController";
import { body, param } from "express-validator"; //npm i express-validator
import { handleInputErrors } from "../middleware/validaton";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExist } from "../middleware/project";
import Task from "../models/Task";
import { hasAuthorization, taskBelogsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/user";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();

//para impplemetar authenticate en todos los endpoints
router.use(authenticate)

router.post(
  "/",
  //implementamos validacion con express-validator
  body("projectName")
    .notEmpty()
    .withMessage("El Nombre del projecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente  es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripcion del proyecto es obligatorio"),
  handleInputErrors,

  ProjectController.createProject
);
router.get("/",authenticate, ProjectController.getAllProjects);

router.get(
  "/:id",
  //expres-validator tabien tiene validacion de parametros
  param("id").isMongoId().withMessage("El id no es valido"),
  handleInputErrors,

  ProjectController.getProyectById
);

//nuestros endpoints con el parametro projectId necesitan validar que el proyecto exista esta en una forma para no repetir codigo
router.param("projectId", validateProjectExist);

router.put(
  "/:projectId",
  //expres-validator tabien tiene validacion de parametros
  param("projectId").isMongoId().withMessage("El id no es valido"),
  body("projectName")
    .notEmpty()
    .withMessage("El Nombre del projecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente  es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripcion del proyecto es obligatorio"),
  handleInputErrors,
  hasAuthorization,
  ProjectController.updateProject
);

router.delete(
  "/:projectId",
  //expres-validator tabien tiene validacion de parametros
  param("projectId").isMongoId().withMessage("El id no es valido"),
  handleInputErrors,
  hasAuthorization,
  ProjectController.deleteProject
);

/**Routes for tasks  */


router.post(
  "/:projectId/tasks",
  hasAuthorization,
  body("name").notEmpty().withMessage("El Nombre de la tarea es obligatoria"),
  body("description").notEmpty().withMessage("La Descripcion es obligatoria"),
  handleInputErrors,
  TaskController.createTask
);

router.get("/:projectId/tasks/", TaskController.getProjecTask);

//utilizamos middelware para verificar que la tarea exista y verificar que la tarea pertenece al project
router.param('taskId', taskExists)
router.param('taskId', taskBelogsToProject)

router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("El id no es valido"),
  handleInputErrors,
  TaskController.getTaskById
);



router.put(
  "/:projectId/tasks/:taskId",
  hasAuthorization,
  param("taskId").isMongoId().withMessage("El id no es valido"),
  body("name").notEmpty().withMessage("El Nombre de la tarea es obligatoria"),
  body("description").notEmpty().withMessage("La Descripcion es obligatoria"),
  handleInputErrors,
  TaskController.updateTask
);

router.delete(
  "/:projectId/tasks/:taskId",
  hasAuthorization,
  param("taskId").isMongoId().withMessage("El id no es valido"),
  handleInputErrors,
  TaskController.deleteTask
);
router.post("/:projectId/tasks/:taskId/status",
 
   param('taskId').isMongoId().withMessage("Id no es valido"),
   body('statys').notEmpty().withMessage("El estado es obligatorio"),

  TaskController.uptadeStatusTask,
  handleInputErrors
) 

/** Routes para colaboradores */
  
router.post("/:projectId/team/find",
  body('email').isEmail().toLowerCase().withMessage('Email no valido'),
  handleInputErrors,
  TeamMemberController.findMeberByEmail
)

router.get('/:projectId/team',
  TeamMemberController.getProjectMembers
)

router.post('/:projectId/team',
  body('id').isMongoId().withMessage('Id no es valido'),
  handleInputErrors,
  TeamMemberController.addMemberById
)

router.delete("/:projectId/team/:userId",
  param('userId').isMongoId().withMessage('Id no es valido'),
  handleInputErrors,
  TeamMemberController.removeMemberById
)


/** Routes for Notes */

router.post('/:projectId/tasks/:taskId/notes',
  body('content').notEmpty().withMessage('El Contenido de la nota es obligatorio'),
  handleInputErrors,
  NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
  NoteController.getTaskNotes
)
router.delete('/:projectId/tasks/:taskId/notes/:noteId',
  param('noteId').isMongoId().withMessage('Id no es valido'),
  handleInputErrors,
  NoteController.deleteNote

)

export default router;
