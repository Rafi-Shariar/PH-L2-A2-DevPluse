import type { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
};

const sendResponse  = <T> (res: Response, data: TResponse<T>) => {

 if(!data.success){

  return res.status(data.statusCode).json({
    success: false,
    message: data.message,
    error : data.error
  });
  
  
 }

  return res.status(data.statusCode).json({
    success: true,
    message: data.message,
    data: data.data !==undefined ? data.data : null,
  });
  
  
};

export default sendResponse;
