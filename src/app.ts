import express from "express";
import cors from "cors";
import type { CorsOptions } from "cors";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions: CorsOptions = {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hey from TS Backend");
});

//User routes
import userRouter from "./routes/user.route.js";
app.use("/api/v1/auth", userRouter);

//Message routes
import messsageRouter from "./routes/message.route.js";
app.use("/api/v1/messages", messsageRouter);

//Thoughts routes
import thoughtRouter from "./routes/thought.route.js";
app.use("/api/v1/thought", thoughtRouter);

import { errorMiddleware } from "./middlewares/error.middleware.js";
app.use(errorMiddleware);
export default app;