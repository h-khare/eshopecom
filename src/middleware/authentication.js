const userComman = require("../utils/userComman")
exports.resetVerify = async (req,res,next)=>{
    try {
        const id = req.params.id;
        const verificationToken = req.params.verificationToken;
        const data={id:id,verificationToken:verificationToken}
        const validUserToken = await userComman.verificationTokenVerify(data);
        req.body.email=validUserToken.email;
        next();
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

exports.resetVeried = async (req,res,next)=>{
    try {
        const token = req.body.token;
        const data={verificationToken:token}
        const validUserToken = await userComman.verificationTokenVerify(data);
        console.log("email",validUserToken)
        req.body.email=validUserToken.email;
        next();
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}