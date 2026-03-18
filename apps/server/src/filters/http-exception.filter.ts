import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
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

      // 简化日志输出
      this.logger.warn(
        `${request.method} ${request.url} - ${status} - ${message}`,
      );
    } else if (exception instanceof Error) {
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${exception.message}`,
      );
      message = exception.message;
    }

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
