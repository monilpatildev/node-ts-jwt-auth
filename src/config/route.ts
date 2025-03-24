import { Application } from "express";
import authRoute from "../components/auth/auth.route";


const initialRoute = (app: Application) : void =>{
  app.use("/api/auth",authRoute);
}

export default initialRoute