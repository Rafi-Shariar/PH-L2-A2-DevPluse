import express, {
  type Application,

} from "express";
import { authRouter } from "./modules/auth/auth.route";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { issuesRoute } from "./modules/issues/issues.route";

const app: Application = express();
app.use(express.json());


app.use('/api/auth', authRouter)
app.use('/api/issues',issuesRoute)




app.use(globalErrorHandler)
export default app;