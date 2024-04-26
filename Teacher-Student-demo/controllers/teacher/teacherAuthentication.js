import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { teacherModel } from '../../models/teacherSchema.js';
import { sendToken } from '../../utils/sendToken.js';
import { sendMail } from '../../utils/sendEmail.js';



export const signUp = async (req, res) => {
    try {
        const { name, email, password, contact } = req.body

        const isUserExists = await teacherModel.findOne({ email: email })
        if (isUserExists) {
            return res.status(422).json({ message: "email is already exist. please try with other email" })
        }

        const otp = Math.floor(100000 + Math.random() * 900000)
        await sendMail(email, "Your OTP for sign up",`OTP : ${otp}`)
        
        const teacherData = await teacherModel.create({ ...req.body, otp: otp, otpExpiration: Date.now() + 300000, role: "teacher", password: await bcrypt.hash(password, 1) })
        if(teacherData){
            return res.status(200).json({ status: true, data: { name: teacherData.name, email: teacherData.email, contact: teacherData.contact} , message: "signUp successfully. sended otp on your email for signIn" })
        }
        
    } catch (error) {
        
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })
    }
}

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body
        const isUserExists = await teacherModel.findOne({ email: email })
        if (!isUserExists) {
            return res.status(422).json({ message: "email not found" })
        }
        const teacherOtp = Math.floor(100000 + Math.random() * 900000)
        await sendMail(email, "Your OTP for sign up" , `OTP : ${otp}`)

        const teacherData = await teacherModel.updateOne({ email: email }, { $set: { otp: teacherOtp, otpExpiration: Date.now() + 300000 } })
        
        if (teacherData.modifiedCount == 1) {
            return res.status(200).json({ status: true, data: teacherData, message: "otp sended on your email" })
        }
    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })
    }
}
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        const isUserExists = await teacherModel.findOne({ email: email })
        if (!isUserExists) {
            return res.status(422).json({ message: "email not found" })
        }
        if (isUserExists.otpExpiration < Date.now()) {
            return res.status(400).json({ success: false, message: 'otp expired' });
        }
        if (isUserExists.otp != otp) {
            return res.status(422).json({ message: "it's wrong otp. please enter correct otp" })
        }
        const teacherData = await teacherModel.updateOne({ email: email }, { $set: { isVerify: true } })
        if (teacherData.modifiedCount == 1) {
            return res.status(200).json({ status: true, data: teacherData, message: "verify successfully." })
        }
    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })
    }
}
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const isUserExists = await teacherModel.findOne({ email: email })
        if (!isUserExists) {
            return res.status(200).json({ message: "email not found" })
        }
        if (!isUserExists.isVerify) {
            return res.status(200).json({ message: "you can't login. please verify your otp after you can login" })
        }
        const isPasswordCompare = await bcrypt.compare(password, isUserExists.password);
        if (!isPasswordCompare) {
            return res.status(200).json({ message: "password invalid" })
        }
        const token = await sendToken(isUserExists._id, "teacher")
        return res.status(200).json({ status: true, token: token, message: "sign-in successfully" })
    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })
    }
}
export const forgotPasswordLink = async (req, res) => {
    try {
        const { email } = req.body
        const isUserExists = await teacherModel.findOne({ email: email })
        if (!isUserExists) {
            return res.status(200).json({ message: "email not found" })
        }
        const token = jwt.sign({
            id: isUserExists._id
        }, process.env.SECRET_KEY, { expiresIn: '10m' });
        console.log('token :>> ', token);
        await sendMail(email,  'Password Reset Link' , `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        http://localhost:${process.env.PORT}/teacher/auth/forgot-password/${token}  \n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`)

        return res.status(200).json({ message: "password reset link has been send to your email..." });

    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({ message: "Something went Wrong. please try again" })
    }
}
export const forgotPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded.id) {
            return res.status(422).json({ message: "token not valid" })
        }
        const teacherData = await teacherModel.findOne({ _id: decoded.id })
        if (!teacherData) {
            return res.status(200).json({ message: "teacher not found" })
        }

        const updatePassword = await teacherModel.updateOne({ _id: decoded.id }, { $set: { "password": await bcrypt.hash(password, 1) } })

        if (!updatePassword) {
            return res.status(200).json({ status: true, data: updatePassword, message: "password not update" })
        }

        return res.status(200).json({ status: true, data: updatePassword, message: "password update successfully" })

    } catch (error) {
        console.log('error :>> ', error.message);
        if (error.message) {
            return res.status(500).json({ message: "link expired." })
        }
        return res.status(500).json({ message: "Something went Wrong. please try again" })

    }
}





