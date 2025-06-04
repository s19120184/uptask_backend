import type { Request, Response } from "express";
export declare class TeamMemberController {
    static findMeberByEmail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static getProjectMembers: (req: Request, res: Response) => Promise<void>;
    static addMemberById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static removeMemberById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
