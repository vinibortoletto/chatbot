import { NextFunction, Request, Response } from "express";

export default interface ILeaderboardController {
  findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
}
