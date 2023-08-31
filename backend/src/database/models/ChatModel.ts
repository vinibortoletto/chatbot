import { Model, DataTypes } from "sequelize";
import db from ".";

export default class ChatModel extends Model {
  declare readonly id: number;
  declare created_at: Date;
  declare ended_at: Date;
  declare messages: string;
}

ChatModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ended_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    messages: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    underscored: true,
    sequelize: db,
    modelName: "chats",
    timestamps: false,
  }
);
