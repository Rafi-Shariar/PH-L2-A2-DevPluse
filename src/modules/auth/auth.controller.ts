import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";

const signupUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signupUserIntoDB(req.body)
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data:result.rows[0]
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

export const authController = {signupUser}
