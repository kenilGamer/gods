const nodemailer = require("nodemailer")
const sendEmail = async (email, subject, text) => {
    try{
        const transporter = nodemailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                auth: {
                  user: process.env.user,
                  pass: process.env.pass
                }
        });
        const usermail = ({
            from: process.env.user,
            to: email,
            subject: 'subject',
            html: '<h1>oppdffvgbhhfkjgyr</h1>'
        })
        await transporter.sendMail(usermail,(error,info)=>{
            if(error){
                console.log(("Error"),error);
            }else{
                console.log("email sent" + info.response);
                resizeBy.status(201).json({status:201,info})
            }
        })
        console.log("opppppppppp");
    } catch (error){
        // console.log(error, "not sent email");
        resizeBy.status(201).json({status:401,error})
    }
}
module.exports = sendEmail;