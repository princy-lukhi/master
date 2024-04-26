import jwt from 'jsonwebtoken'
import { studentModel } from '../models/studentSchema.js'
import { teacherModel } from '../models/teacherSchema.js'


export const verifyToken = (expectedRole) => async (req, res, next) => {

    try {
        const authorization = req.get("Authorization")
        if (!authorization) {
            return res.status(401).json({ message: "Token Required!!!" })

        }
        const token = authorization.split(' ')[1]

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!expectedRole.includes(decoded.role)) {
            return res.status(401).json({ message: "Unauthorized!!!" })
        }

        if (decoded.role == "teacher") {
            const isTeacher = await teacherModel.findOne({ _id: decoded.id })
            if (!isTeacher) {
                return res.status(401).json({ message: "Unauthorized" });
            }
        }
        if (decoded.role == "student") {
            const isStudent = await studentModel.findOne({ _id: decoded.id })
            if (!isStudent) {
                return res.status(401).json({ message: "Unauthorized" });
            }
        }
        req.userId = decoded.id
        next()
    } catch (error) {
        return res.status(401).json({ message: "token expired" })
    }
}