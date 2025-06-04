import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/User";
declare global {
    namespace Express {
        interface Request {
            user: IUser;
        }
    }
}
export declare function UserExists(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
export declare function UserLoginExist(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
