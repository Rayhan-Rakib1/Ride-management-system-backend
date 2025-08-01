import express, { Application, Request, Response } from "express";
import { router } from "./Routes/routes";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import passport from "passport";
import cookieParser from "cookie-parser";
import { envVers } from "./config/env";
import cors from "cors";
import expressSession from "express-session";
import "./config/passport";


export const app: Application = express();

app.use(
  expressSession({
    secret: envVers.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use('/api', router)

app.get('/', async(req: Request, res: Response) => {
    res.send('server is running')
})

app.use(globalErrorHandler);
app.use(notFound);