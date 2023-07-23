const express = require("express");
const router = new express.Router();
const userController = require("../controllers/userController");
const validation = require("../middleware/validations/validations")
const userValidation = require("../middleware/validations/userValidator")
const authentication = require("../middleware/authentication")
router.post("/registration",validation(userValidation.createUser),userController.registration);
router.post("/login",validation(userValidation.loginUser),userController.login);
router.get("/verify/:id/:uniqueString",userController.verifyUser);
router.post("/verfiedotp",validation(userValidation.userVerification),userController.verifyOtp);
router.post("/forgetPassword",userController.forgetPassword);
router.get("/verifyTokenPassword/:id/:verificationToken",authentication.resetVerify,userController.tokenVerified);
router.post("/resetPassword",authentication.resetVeried,userController.resetPassword);

module.exports = router;