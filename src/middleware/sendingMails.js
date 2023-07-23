const nodemailer = require("nodemailer")
let transporter = new nodemailer.createTransport({
    service:"gmail.com",
    auth:{
        user:'khare98939@gmail.com',
        pass:'skzgztcavthhylgm'
    }
})
transporter.verify((error,success)=>{
    if(error){
        console.log(error);
    }
    else
    {
        console.log(success)
    }
})
exports.sendMails = (mail_option)=>{
    return  new Promise((resolve,reject) => {
        transporter.sendMail(mail_option,function(error,result){
            console.log("Mail Sent Successfully");
            resolve("Sent Mail")
        })
    })
}