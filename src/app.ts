import express, {
  type Application,

} from "express";
import { authRouter } from "./modules/auth/auth.route";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();
app.use(express.json());


app.use('/api/auth', authRouter)
app.use(globalErrorHandler)
export default app;