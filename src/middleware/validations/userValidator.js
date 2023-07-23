const Joi = require("joi")

const userValidations = {
    createUser: Joi.object().keys({
        name:Joi.string().required(),
        email:Joi.string().required(),
        mobile:Joi.number().required(),
        password:Joi.string().required(),
    }),
    loginUser:Joi.object().keys({
        email:Joi.string().required(),
        password:Joi.string().required()
    }),
    userVerification:Joi.object().keys({
        number:Joi.string().required(),
        otp:Joi.string().required()
    })
}

module.exports = userValidations;