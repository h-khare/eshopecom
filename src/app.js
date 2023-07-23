require("dotenv").config()
const express = require("express");
const router = require("./routes/index")
const app = express();
const file=require("./config/db")
app.use(express.json());
app.use(router);
app.listen(process.env.PORT);
