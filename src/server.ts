import express from 'express';
import cors from 'cors';
import trackRouter from "./routes/trackRoutes.js";
import artistRouter from "./routes/artistRoutes.js";
import albumRouter from "./routes/albumRoutes.js";

// Create Express server
const app = express();
const port: string | number = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", trackRouter, albumRouter, artistRouter);
app.use("/", async (_req, res) => {
    res.send("Server.js is running🎉")
})

// Start Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});