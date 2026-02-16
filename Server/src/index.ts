import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route";
import adminRouter from "./routes/admin.route";
import walletRouter from "./routes/wallet.route";
// import signalRouter from "./routes/signal.route"


const app: Express = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, //true

    // methods:["POST", "GET", "PUT", "PATCH", "DELETE"]
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("Welcome to DecentraPoll");
});

//Routes
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/trade", walletRouter);



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));