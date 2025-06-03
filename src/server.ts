import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { corsConfig } from './config/cors';
import { connectDB  } from './config/db';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes'



dotenv.config()//para poder utilizar las variables de entorno

connectDB();

const app = express();
// usar la configuracion de Cors
app.use(cors(corsConfig))

//loggin 
app.use(morgan('dev'))

//abilitamos la lectura de JSON lee los datos del formulario
app.use(express.json())


// routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes);



export default app