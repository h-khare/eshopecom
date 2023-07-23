const express = require("express");
const router = new express.Router();
const userRouter = require("./userRouter");
router.use("/user",userRouter);
module.exports = router;