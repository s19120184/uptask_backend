import { NextFunction, Request, Response } from "express";
export declare const handleInputErrors: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
