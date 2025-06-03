import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import Task, { ITask } from "./Task";
import { IUser } from "./User";
import Note from "./Note";

//Document & hereda todas las props de Document
export interface IProject extends Document {
  projectName: string;
  clientName: string;
  description: string;
  tasks: PopulatedDoc<ITask & Document>[]; //un proyecto puede tener muchas tareas
  manager: PopulatedDoc<IUser & Document>;
  team: PopulatedDoc<IUser & Document>[];
}

//para una tabla en mongoose
const ProyectSchema: Schema = new Schema(
  {
    projectName: {
      type: String,
      require: true,
      trim: true
    },
    clientName: {
      type: String,
      require: true,
      trim: true
    },
    description: {
      type: String,
      require: true,
      trim: true
    },
    tasks: [
      {
        type: Types.ObjectId,
        ref: "Task"
      }
    ],
    manager: {
      type: Types.ObjectId,
      ref: "User"
    },
    team: [
      {
        type: Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
); //para saber cuando fue la ultima actualizacion utilizamos timestamps

//Middleware para cuando utilizemos deleteOne se elimenen las tareas que pertenecen al proyecto
ProyectSchema.pre('deleteOne',{document:true , query : false }, async function(){
  const projectId= this._id

  const tasks = await Task.find({project :projectId})

  for(const task of tasks){
    await Note.deleteMany({task:task.id})
  }

  if(!projectId)return
  await Task.deleteMany({project:projectId})
})

// creamos el modelo el primer parametro deve ser un nombre unico y el segundo es el de nuestro schema
const Proyect = mongoose.model<IProject>("Proyect", ProyectSchema);
export default Proyect;
