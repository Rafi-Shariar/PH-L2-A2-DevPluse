import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import type { JwtPayload } from "jsonwebtoken";
import { issueService } from "./issues.service";
import { pool } from "../../db";

const createIssue = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayload;
    const reportedId = user.id;
    const result = await issueService.createIssueIntoDB(req.body, reportedId);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await issueService.getSingleIssueFromDB(id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as JwtPayload;
  const reporter_role = user.role;

  try {
    const issue = await issueService.getSingleIssueFromDB(id as string);

    let canUpdate = false;

    if (reporter_role === "maintainer") {
      canUpdate = true;
    } else {
      const issueReporterID = issue.reporter?.id;
      const issueStatus = issue.status;

      if (issueReporterID === user.id && issueStatus === "open") {
        canUpdate = true;
      }
    }

    if (!canUpdate) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden",
        });
      }

      if (canUpdate) {
        const result = await issueService.updateIssueIntoDB(
          id as string,
          req.body,
        );

        sendResponse(res, {
          statusCode: 200,
          success: true,
          message : "Issue updated successfully",
          data: result.rows[0],
        });
      }
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const deleteIssue = async(req: Request, res: Response) =>{

  const {id} = req.params;

  try {

    const issue = await issueService.getSingleIssueFromDB(id as string)

    const user = req.user as JwtPayload;

    if(!issue){
      return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Issue Not Found!"
    });
    }

    if(user.role === "maintainer"){

      const result = await issueService.deleteIssueintoDB(id as string)
      sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully"
    });

    }
    else{
      sendResponse(res, {
      statusCode: 403,
      success: false,
      message: "Forbidden! Don't have permission to delete."
    });
    }
    
  } catch (error:any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }

}

export const issuesController = { createIssue, getSingleIssue, updateIssue, deleteIssue };
