import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.EMAIL_ADDRESS}`,
        pass: `${process.env.EMAIL_PASSWORD}`
      },
    secure: true,
});


export const sendMail = async(email , subject , text ) => {
    const mailOptions = {
        from: 'princil.tagline@gmail.com',
        to: email, //email
        subject: subject,
        text: text,
    };
    
    const isMailSend = await  transporter.sendMail(mailOptions)
    return isMailSend.response
}