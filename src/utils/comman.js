require("dotenv/config")
const jwt = require("jsonwebtoken")
exports.generateToken =  (user) =>{
    return new Promise((resolve,reject)=>{
        try {
            const token = jwt.sign({id:user.id,email:user.email},process.env.SECRECTKEY,{
                expiresIn:"5m"
            })
            resolve(token)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}