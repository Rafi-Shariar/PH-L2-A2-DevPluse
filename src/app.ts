import express, {
  type Application,

} from "express";
import { authRouter } from "./modules/auth/auth.route";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { issuesRoute } from "./modules/issues/issues.route";
import cors from "cors";
const app: Application = express();

app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(express.json());


app.use('/api/auth', authRouter)
app.use('/api/issues',issuesRoute)




app.use(globalErrorHandler)
export default app;