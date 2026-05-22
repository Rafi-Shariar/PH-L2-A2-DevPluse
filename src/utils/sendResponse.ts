import type { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  if (!data.success) {
    return res.status(data.statusCode).json({
      success: false,
      message: data.message,
      error: data.error,
    });
  }

  const responseBody : Record <string,any> = {
    success: true,
    message: data.message,
  }

  if(data.data !== undefined){
    responseBody.data = data.data;
  }

  return res.status(data.statusCode).json(responseBody);
};

export default sendResponse;
