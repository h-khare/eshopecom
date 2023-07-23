require("dotenv").config()
const sendingMail = require("../middleware/sendingMails")
const{v4:uuid4} = require("uuid")
const OTP = require("otp-generator")
const loadash = require("lodash")
const bcrypt = require("bcrypt")
const {UserVerification,User,Verification} = require("../models/index")
const axios = require("axios")
const otpSending = require("../middleware/sendingOtp")
const os = require('os');

exports.getLocalIP=()=> {
  const interfaces = os.networkInterfaces();
  for (const key in interfaces) {
    for (const iface of interfaces[key]) {
      if (!iface.internal && iface.family === 'IPv4') {
        console.log(`Local IP Address: ${iface.address}`);
        return iface.address;
      }
    }
  }
  return null;
}
function getLocalIPs(){
    const interfaces = os.networkInterfaces();
    for (const key in interfaces) {
      for (const iface of interfaces[key]) {
        if (!iface.internal && iface.family === 'IPv4') {
          console.log(`Local IP Address: ${iface.address}`);
          return iface.address;
        }
      }
    }
    return null;
  }
exports.sendVerificaitonEmail=({id,email})=>{
    return new Promise(async (resolve,reject)=>{
        try {
            const currentUrl = `https://eshopcom.onrender.com/`
            const uniqueString = uuid4() +id;
            console.log(uniqueString)
            const mail_option = {
                from:'khare98939@gmail.com',
                to:`${email}`,
                subject:`Verify your email`,
                html:`<p>
                    Verify the email address to signuo and login with your crdentials the verification link will be expires in 6 hours 
                </p>
                    <p>Press <a href=${currentUrl+"user/verify/"+id+"/"+uniqueString}>here</a> to proceed</p>
                `
            };
            const salt =10;
            const harsh = await bcrypt.hash(uniqueString,salt);
            const date = Date.now() + 60*60*1000;
            const newVerification = await UserVerification.create({
                userId:id,
                uniqueString:harsh,
                expireAt:date
            })

                const result = await sendingMail.sendMails(mail_option);
                if(!result)
                {reject(result)}
                else
                {
                    resolve(result)
                }
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

exports.verifyUser = (data)=>{
    return new Promise(async (resolve,reject)=>{
        try {
            const checkUser = await UserVerification.findOne({
                where:{
                    userId:data.id
                }
            })
            if(checkUser)
            {
               if(checkUser.expireAt<Date.now())
               {
                    const result = await UserVerification.destroy({
                        where:{
                            userId:data.id
                        }
                    })
                    if(result)
                    {
                        const user = await User.destroy({
                            where:{
                                id:data.id
                            }
                        })
                    }
                    else
                    {
                        reject(result)
                    }
               }
               else
               {
                let isMatch= await bcrypt.compare(data.uniqueString,checkUser.uniqueString);
                if(isMatch)
                {
                    const user = await User.update({varified:true},{
                        where:{
                            id:data.id
                        }
                    })
                    if(user)
                    {
                        await UserVerification.destroy({
                            where:{
                                userId:data.id
                            }
                        })
                        resolve(user);
                    }
                    else
                    {
                        reject(user)
                    }
                }
               }
            }
            else
            {
                reject("Verification Link expired..!")
            }
        } catch (error) {
            console.log(error,'error')
            reject(error)
            
        }
    })
}

exports.sendVarificationOtp = async (number)=>{
    return new Promise(async (resolve,reject)=>{
        try {
            const otp = OTP.generate(6, {
                digits: true,
                alphabets: false,
                upperCase: false,
                specialChars: false
              });
            const newOtp = await bcrypt.hash(otp,10);
            console.log(otp)
            const expires = Date.now()+30*60*1000;
            const otps = await Verification.create({number:number,otp:newOtp,expireAt:expires});
            if(otps)
            {
                const result = await otpSending.sendSMS(number,otp);
                if(result){
                resolve("Otp Send Succeffully")
                }
                else
                {
                    reject(result)
                }
            }
            else
            {
                reject(otps)
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

exports.verifiedOtp = async (data)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const user = await User.findOne({
                where:{
                    mobile:BigInt(data.number.substring(3,data.number.length))
                }
            })
            if(user)
            {
                reject({message:"user already present"})
            }
            else{
                const verifiedNumber = await Verification.findOne({where:{number:data.number}})
                if(verifiedNumber)
                {
                    if(verifiedNumber.expireAt<Date.now())
                    {
                        await Verification.destroy({
                            where:{
                                number:data.number
                            }
                        })
                        await User.destroy({
                            where:{
                                mobile:BigInt(data.number.substring(3,data.number.length))
                            }
                        })
                        resolve({message:"OTP expires please signup again"})
                    }
                    else
                    {
                        const isValid = await bcrypt.compare(data.otp,verifiedNumber.otp);
                        if(isValid) {
                            await Verification.destroy({where:{number:data.number}})
                            await User.update({varified:true},{where:{
                                mobile:data.number  
                            }})
                            resolve({message:"User veryfication successfull"})
                        }
                        else
                        {
                            resolve({message:"Please enter a valid otp"})
                        } 
                    }
                }
                else
                {
                    resolve({message:"User Not found..!"})
                }
            }
        } catch (error) {
            console.log(error)
            reject({message:error});
        }
    })
}
