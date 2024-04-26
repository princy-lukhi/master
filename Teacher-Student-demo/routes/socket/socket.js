import express from 'express';
import { oneToOneChatting } from '../../controllers/socket/socketController.js';
import { verifyToken } from '../../middleware/verifyToken.js';
const socketRoute = express.Router();

socketRoute.get("/one-to-one" , oneToOneChatting );


export default socketRoute;
