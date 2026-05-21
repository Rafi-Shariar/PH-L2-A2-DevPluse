import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import type { JwtPayload } from "jsonwebtoken";
import { issueService } from "./issues.service";

const createIssue = async (req: Request, res: Response) => {
  try {
    
    const user = req.user as JwtPayload;
    const reportedId = user.id;
    const result = await issueService.createIssueIntoDB(req.body,reportedId)

    sendResponse(res,{
      statusCode:201,
      success:true,
      message : "Issue created successfully",
      data : result.rows[0]
    })
    
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const issuesController = {createIssue}
