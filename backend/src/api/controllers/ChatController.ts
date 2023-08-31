import { NextFunction, Request, Response } from "express";
import { CREATED, OK } from "../../utils/httpStatusCodes";
import { IChatController, IChatService } from "../interfaces";

export default class ChatController implements IChatController {
  constructor(private _chatService: IChatService) {}

  public async findAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const chats = await this._chatService.findAll();
      console.log(chats);

      return res.status(OK).json(chats);
    } catch (error) {
      next(error);
    }
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const newChat = req.body;

    try {
      const chat = await this._chatService.create(newChat);
      return res.status(CREATED).json(chat);
    } catch (error) {
      console.log(error);

      next(error);
    }
  }
}
