import { ArgumentsHost, Catch, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Prisma } from "@prisma/client";
import { Record } from "@prisma/client/runtime/library";
import { Response } from "express";

type ErrorResponse = {
  statusCode: number;
  message: string;
};

const ERROR_CATALOG: Record<string, ErrorResponse> = {
  P2002: {
    statusCode: HttpStatus.CONFLICT,
    message: "resource already exists",
  },
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errorMessage = exception.message.replace(/\n/g, "");

    const DEFAULT_ERROR: ErrorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: errorMessage,
    };

    const { statusCode, message }: ErrorResponse = ERROR_CATALOG[exception.code] ?? DEFAULT_ERROR;

    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
