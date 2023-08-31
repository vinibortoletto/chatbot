import { NextFunction } from "express";
import ChatModel from "../../database/models/ChatModel";

export default interface ILeaderboardController {
  findAll(): Promise<ChatModel[]>;
  create(chat: ChatModel): Promise<ChatModel>;
}
