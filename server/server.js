import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("Server is live");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
