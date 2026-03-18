import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
  Optional,
} from "@nestjs/common";
import { Response } from "express";
import { PinoLogger, InjectPinoLogger } from "nestjs-pino";

/**
 * 全局异常过滤器
 * 统一错误响应格式
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @InjectPinoLogger()
    private readonly logger: PinoLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let error = "Internal Server Error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "object") {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || exception.message;
        error = (responseObj.error as string) || exception.name;
      } else {
        message = exceptionResponse as string;
        error = exception.name;
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        {
          err: exception,
          method: request.method,
          url: request.url,
          body: request.body,
          query: request.query,
        },
        "Unhandled error: %s",
        exception.message,
      );
      message = exception.message;
    }

    // 记录 HTTP 错误日志
    this.logger.warn(
      {
        method: request.method,
        url: request.url,
        statusCode: status,
        message,
        error,
      },
      "HTTP Error",
    );

    const responseBody = {
      success: false,
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(responseBody);
  }
}
