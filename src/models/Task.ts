import mongoose, { Schema, Document, Types } from "mongoose";
import { IProject } from "./Project";
import Note from "./Note";

//creamos un diccionario para el estatus de las tareas
const taskStatus = {
  PENDING: "pending",
  ON_HOLD: "onHold",
  IN_PROGRESS: "inProgress",
  UNDER_REVIEW: "underReview",
  COMPLETED: "completed"
} as const;

//creamos el type para que solo se pueda usar los valores del diccionario
export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];

export interface ITask extends Document {
  name: string;
  description: string;
  project: Types.ObjectId;
  status: TaskStatus;
  completedBy:{ 
      user:Types.ObjectId
      status:TaskStatus

  }[]
  notes:Types.ObjectId[]
}
// cada tarea pertenece a un proyecto asi que tenemos que relacionar estas
export const TaskSchema: Schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    description: {
      type: String,
      trim: true,
      required: true
    },
    project: {
      type: Types.ObjectId,
      ref: "Proyect" // esta es la referencia es  el nombre unico que le damos cuando creamos en modelo de project
    },
    status: {
      type: String,
      enum: Object.values(taskStatus),
      default: taskStatus.PENDING
    },
    completedBy: [
      {
        user: {
          type: Types.ObjectId,
          ref: "User",
          default: null
        },
        status: {
          type: String,
          enum: Object.values(taskStatus),
          default: taskStatus.PENDING
        }
      }
    ],
    notes:[
      {
        type:Types.ObjectId,
        ref:'Note'
  
      }
    ]
  },
 
  { timestamps: true }
);

//Middleware para cuando utilizemos deleteOne se elimenen las notas de la que pertenecena la tarea
TaskSchema.pre('deleteOne',{document:true , query : false }, async function(){
      const taskId= this._id
      if(!taskId)return
      await Note.deleteMany({task:taskId})
})

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
