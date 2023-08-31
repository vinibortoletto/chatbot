import { ModelStatic } from "sequelize";
import ChatModel from "../../database/models/ChatModel";
import { IChatService } from "../interfaces";

export default class ChatService implements IChatService {
  private _chatModel: ModelStatic<ChatModel> = ChatModel;

  public async findAll(): Promise<ChatModel[]> {
    const chat = await this._chatModel.findAll();
    return chat;
  }

  public async create(chat: ChatModel): Promise<ChatModel> {
    const newChat: ChatModel = await this._chatModel.create({ ...chat });
    return newChat;
  }
}
