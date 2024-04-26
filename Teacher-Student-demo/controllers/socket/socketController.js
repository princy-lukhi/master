import { io } from "../../index.js";
import path from 'path'
import jwt from 'jsonwebtoken'
import { fileURLToPath } from 'url';
import { teacherModel } from "../../models/teacherSchema.js";
import { studentModel } from "../../models/studentSchema.js";

export const oneToOneChatting = (req, res) => {
    try {

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename)
        res.sendFile(path.resolve(__dirname, '../../public/socketTemplate.html'));

        // io.use(async (socket, next) => {
        //     if (socket.handshake.auth.token) {
        //         const token = socket.handshake.auth.token
        //         const decoded = jwt.verify(token, process.env.SECRET_KEY);
        //         const { id, role } = decoded
        //         if (role && id) {
        //             const isUserTeacher = await teacherModel.findOne({ _id: id, role: "teacher" })
        //             const isUserStudent = await studentModel.findOne({ _id: id, role: "student" })
        //             if (isUserTeacher || isUserStudent) {
        //                 req.senderId = id
        //                 next()
        //             }

        //         }
        //     }
        // });

        let room = 1;
        let member = 0;

        io.on('connection', (socket) => {

            console.log("user connected :" + socket.id);

            if (member == 2) {
                room++;
                member = 0;
            }

            member++;

            socket.on('sendMessage', (message) => {
                socket.join(`room-${room}`)
                // console.log('room :>> ', "room", room);
                console.log('message :>> ', message);
                socket.to(`room-${room}`).emit('receiveMessage' , message)
                // console.log('socket.id :>> ', socket.id);
            });

            // const getChat = io.sockets.clients(`room-${room}`);
            // const getChat = io.of('/').in(`room-`).clients;
            // console.log('getChat :>> ', getChat);

            // getChat.forEach(function (client) {
            //     console.log('Username: ' + client.nickname);
            // });


            socket.on('disconnect', () => {
                console.log("user disconnected");
            })
        })

        // return res.status(200).json({message : "ok"})
    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })
    }
}