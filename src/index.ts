import dotenv from "dotenv";
import app from "./app.js";
import connectDb from "./config/db.js";
import { PORT } from "./config/env.js";

dotenv.config({path: "./.env"});

connectDb()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening to port: ${PORT}`);
    })
})

.catch((error) => {
    console.log("Error while connecting to MongoDB: ", error);
});