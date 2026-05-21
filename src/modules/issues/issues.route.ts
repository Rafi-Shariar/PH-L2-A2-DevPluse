import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types";
import { issuesController } from "./issues.controller";

const router = Router();
router.post('/', auth(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.createIssue)
router.get('/:id',issuesController.getSingleIssue)

export const issuesRoute = router;