import { Router } from "express";
import { ChatController } from "../controllers";
import { ChatService } from "../services";

const router = Router();
const service = new ChatService();
const controller = new ChatController(service);

router.get("/chats", controller.findAll.bind(controller));
router.post("/chats", controller.create.bind(controller));

export default router;
