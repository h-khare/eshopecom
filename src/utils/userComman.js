const { invalid, string, valid } = require("joi");
const {User,resetPassword} = require("../models/index")
const randomString = require("random-string")
const userVerification = require("./userVerification")
const sendingMail = require("../middleware/sendingMails")
const bcrpyt = require("bcrypt")
exports.registerUser = (user)=>{
    return new Promise(async (resolve,reject)=>{
        try {
            const new_user= await User.create(user);
            console.log(new_user)
            const result = await userVerification.sendVerificaitonEmail({id:new_user.id,email:new_user.email});
            // const result = await userVerification.sendVarificationOtp(user.mobile);
            resolve(new_user,result,'jsfvsvsvchvsdhvsdh');
        } catch (error) {
            console.log(error,"hh")
            reject("Error creating user");
        }
    })
}
exports.loginUser = (login) => {
    return new Promise(async (resolve,reject)=>{
        try {
            const user = await User.findOne({
                where:{
                    email:login.email
                }
            });
            if(!user) reject("User not found")
            else{
                if(!user.varified)
                {
                    reject("Please verify your email then login..!")
                }
                else
                {
                    const isvalid=await user.passwordValidate(login.password);
                    console.log("Harsh ",isvalid)
                    if(isvalid)
                    {
                        resolve(user);
                    }
                    else
                    {
                        reject("Invaid User");
                    }
                }
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

exports.forgetPassword = (email)=>{
    return new Promise(async (resolve,reject)=>{
        try {
            const user = await User.findOne({
                where:{
                    email:email
                }
            });
            if(user){   
                const expireAt = Date.now() + 30*60*100;
                const stringString = randomString({length:16});
                const resetPasswordObj = await resetPassword.create({userId:user.id,userEmail:user.email,tokenValue:stringString,expireAt:expireAt})
                if(resetPasswordObj)
                {
                    const currentUrl = `https://eshopcom.onrender.com/`;
                    const mail_option = {
                        from:'khare98939@gmail.com',
                        to:`${user.email}`,
                        subject:`Reset Password Link`,
                        html:`<p>
                            This is your password reset link. 
                        </p>
                            <p>Press <a href=${currentUrl+"user/verifyTokenPassword/"+user.id+"/"+stringString}>here</a> to reset</p>
                        `
                    };
                    console.log(`${currentUrl+"user/verifyTokenPassword/"+user.id+"/"+stringString}`)
                    const result = await sendingMail.sendMails(mail_option);
                    if(result)
                    {
                        resolve({success:true,message:"Reset link should be sent to your email"});
                    }
                    else
                    {
                        reject("Email not sent")
                    }
                }
                else
                {
                    reject("Error sending the resent link")
                }
            }
            else
            {
                reject("User not found")
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}
exports.verificationTokenVerify = (body)=>{
    return new Promise(async (resolve,reject)=>{
        try {
            console.log(body)
            let whereCondition={}
           if(body.id)
           {
                whereCondition["userId"]=body.id;
           }
           if(body.id)
           {
             whereCondition['userId']=body.id
           }
            if(body.verificationToken)
            {
                whereCondition['tokenValue']=body.verificationToken;
            }
            console.log(whereCondition)
            const validToken = await resetPassword.findOne({
                where:whereCondition
            });
            if(validToken)
            {
                if(validToken.expireAt<Date.now())
                {
                    whereCondition['userEmail']=validToken.userEmail,
                    await resetPassword.destroy({
                        where:whereCondition
                    })
                    reject("Verification link expired");
                }
                else
                {
                    await resetPassword.update({
                        used:1
                    },{
                        where:{
                            userEmail:validToken.userEmail
                        }
                    })
                    resolve({token:validToken.tokenValue,email:validToken.userEmail});
                }
            }
            else
            {
                reject("Verification linked expired");
            }
        } catch (error) {
            console.log(error);
            reject(error)
        }
    })
}
exports.resetPassword = (body)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const newPassword = body.newPassword;
            const confirmPassword = body.confirmPassword;
            if(newPassword===confirmPassword)
            {
                const password = await bcrpyt.hash(newPassword,10);
                const validUser = await resetPassword.findOne({
                    where:{
                        used:1,
                        tokenValue:body.token
                    }
                })
                console.log(validUser,"jhavfdavvd")
                if(validUser)
                {
                    const user = await User.update({
                        password:password
                    },{
                        where:{
                            email:body.email,
                            id:validUser.userId
                        }
                    });
                    await resetPassword.destroy({
                        where:{
                            used:1,
                            tokenValue:body.token
                        }
                    })
                    if(user) resolve({success:true,message:"Password reset successfully"});
                }
                else
                {
                    reject("Invalid Credentials")
                }
            }
            else
            {
                reject("Password are not matched..!")
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}