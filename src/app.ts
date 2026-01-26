import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hey from TS Backend");
});

import userRouter from "./routes/user.route.js";
app.use("/api/v1/auth", userRouter);

import messsageRouter from "./routes/message.route.js";
app.use("/api/v1/messages", messsageRouter);

export default app;