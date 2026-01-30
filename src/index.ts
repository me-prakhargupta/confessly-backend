import dotenv from "dotenv";
import app from "./app.js";
import connectDb from "./config/db.js";
import { PORT } from "./config/env.js";

dotenv.config({path: "./.env"});

connectDb()
.then(() => {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running at: ${PORT}`);
    })
})

.catch((error) => {
    console.log("Error while connecting to MongoDB: ", error);
});