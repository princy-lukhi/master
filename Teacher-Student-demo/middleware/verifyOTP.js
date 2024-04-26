export const verifyOtp = (schema) => async(req,res,next) =>{
    try {
        const teacherData = await schema.findOne({email : req.body.email})
        if (!teacherData) {
            return res.status(200).json({ message: "email invalid" })
        }
        if(teacherData.otp != req.body.otp){
            return res.status(404).json({ message: "please enter correct otp" })
        }
        next()
    } catch (error) {
        console.log('error :>> ', error);
    }
}