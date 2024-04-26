import 'dotenv/config'
import './config/dbConnect.js'
import express from 'express';
import indexRoute from './routes/indexRoute.js'
import { cronForSendMailToStudent } from './utils/cronForSendMail.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import socketRoute from './routes/socket/socket.js';
import { verifyToken } from './middleware/verifyToken.js';
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 3000;

app.use(express.json());
// io.on('connection', (socket) => {
//     console.log("user connected");
    
//     socket.on('chat message', (msg) => {
//         io.emit('chat message1', msg)
//     });
    
//     socket.on('disconnect', () => {
//         console.log("user disconnected");
//     })
// })
app.use("/", indexRoute);

cronForSendMailToStudent()


httpServer.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
export { io };