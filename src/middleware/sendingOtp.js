const twilio = require("twilio")
const accountSid = 'AC7739bb57d088fd57076d766c68553b9c';
const authToken = '07b3c5144977ccfe9c48c801c13bba4e';

const client = twilio(accountSid,authToken)

exports.sendSMS =(number,otp)=>{
    return new Promise(async (resolve,reject)=>{
        try {
            const from = '+12703723042';
            const to = `${number}`;
            const message = `This is your 6 digit verification OTP ${otp}`
            const response = await client.messages.create({
                body:message,
                from:from,
                to:to
            })
            if(response)
            {
                resolve(response.sid);
            }
            else
            {
                reject(response)
            }
        } catch (error) {
            console.log(error);
            reject(error)
        }
    })
}