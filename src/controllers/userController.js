const userComman = require("../utils/userComman")
const userVerification = require("../utils/userVerification")
const path = require("path")
const comman = require("../utils/comman")
exports.registration =async (req,res)=>{
    try {
    const user = await userComman.registerUser(req.body);
    res.send({success:true,message:"Verification otp send to your registerd mobile number",user}) 
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}



exports.login = async (req,res)=>{
    try {
        const user = await userComman.loginUser(req.body);
        if(user)
        {
            const token = await comman.generateToken(user);
            res.send({success:true,message:"Login Successfully",token});
        }
        else
        {
            res.send({success:false,message:"Please enter correct user and email"});
        }
    } catch (error) {
        console.log(error);
        res.send({success:false,message:error})
    }
}
exports.verifyUser = async (req,res)=>{
    try {
        const id = req.params.id;
        const uniqueString =req.params.uniqueString;
        const user = await userVerification.verifyUser({id,uniqueString});
        if(!user)
        {
            console.log(user,"ahgfasvdvafvuv")
            res.send(user);
        }
        else
        {
            res.sendFile(path.join(__dirname,"../public/index.html"))
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
exports.verified = async (req,res)=>{
    try{
        console.log(req)
        res.sendFile(path.join(__dirname,"../public/index.html"))
    }
    catch(error)
    {
        console.log(error);
        res.send(error)
    }
}
exports.verifyOtp = async(req,res)=>{
    try{
        const verifyUser = await userVerification.verifiedOtp(req.body);
        res.send({sucess:true,message:verifyUser.message});
    }
    catch(error)
    {
        console.log(error)
        res.send({sucess:true,message:error})
    }
}

exports.forgetPassword = async (req,res)=>{
    try {
        const token = await userComman.forgetPassword(req.body.email);
        res.send(token)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
} 
exports.tokenVerified = async (req,res)=>{
    try {
        // await userComman.resetPassword()    
        res.send({
            token:req.params.verificationToken
        })
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
exports.resetPassword = async (req,res)=>{
    try {
        console.log(req.body)
        const user = await userComman.resetPassword(req.body);    
        res.send({
            user
        })
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}