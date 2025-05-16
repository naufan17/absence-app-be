import { Response } from "express";
import HTTP_STATUS from 'http-status-codes';

export const responseOk = <T>(res: Response, message: string, data?: T) => {
  res.status(HTTP_STATUS.OK).json({
    statusCode: HTTP_STATUS.OK,
    message,
    data,
  });
};

export const responseCreated = <T>(res: Response, message: string, data?: T) => {
  res.status(HTTP_STATUS.CREATED).json({
    statusCode: HTTP_STATUS.CREATED,
    message,
    data,
  });
};

export const responseBadRequest = (res: Response, message: string) => {
  res.status(HTTP_STATUS.BAD_REQUEST).json({
    statusCode: HTTP_STATUS.BAD_REQUEST,
    message,
  });
};

export const responseUnauthorized = (res: Response, message: string) => {
  res.status(HTTP_STATUS.UNAUTHORIZED).json({
    statusCode: HTTP_STATUS.UNAUTHORIZED,
    message,
  });
}

export const responseForbidden = (res: Response, message: string) => {
  res.status(HTTP_STATUS.FORBIDDEN).json({
    statusCode: HTTP_STATUS.FORBIDDEN,
    message,
  });
}

export const responseNotFound = (res: Response, message: string) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    statusCode: HTTP_STATUS.NOT_FOUND,
    message,
  });
};

export const responseConflict = (res: Response, message: string) => {
  res.status(HTTP_STATUS.CONFLICT).json({
    statusCode: HTTP_STATUS.CONFLICT,
    message,
  });
};

export const responseInternalServerError = (res: Response, message: unknown) => {
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message,
  });
};