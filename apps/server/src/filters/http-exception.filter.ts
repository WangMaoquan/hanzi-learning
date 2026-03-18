import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { PinoLogger, InjectPinoLogger } from "nestjs-pino";
import {
  ErrorCode,
  ErrorCodeToStatus,
  ErrorCodeMessage,
} from "../constants/error-code";

/**
 * 业务异常
 * 使用自定义错误码
 */
export class BusinessException extends Error {
  constructor(
    public readonly code: string,
    message?: string,
  ) {
    super(message || ErrorCodeMessage[code] || "未知错误");
    this.name = "BusinessException";
  }

  getStatus(): number {
    return ErrorCodeToStatus[this.code] || HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

/**
 * 全局异常过滤器
 * 统一错误响应格式，包含错误码
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
    let code: string = ErrorCode.INTERNAL_SERVER_ERROR;
    let message = "服务器内部错误";

    // 业务异常
    if (exception instanceof BusinessException) {
      status = exception.getStatus();
      code = exception.code as string;
      message = exception.message || "未知错误";
    }
    // HTTP 异常
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "object") {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || exception.message;
      } else {
        message = exceptionResponse as string;
      }

      // 尝试从错误消息映射到错误码
      code = this.mapToErrorCode(status, message) as string;
    } else if (exception instanceof Error) {
      code = ErrorCode.INTERNAL_SERVER_ERROR;
      message = exception.message;
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${message}`,
      );
    }

    // 简化日志输出
    if (exception instanceof HttpException) {
      this.logger.warn(
        `${request.method} ${request.url} - ${status} - ${message}`,
      );
    }

    const responseBody = {
      success: false,
      code,
      message,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(responseBody);
  }

  /**
   * 根据状态码和消息映射到错误码
   */
  private mapToErrorCode(status: number, message: string): string {
    // 404 错误根据路径判断模块
    if (status === HttpStatus.NOT_FOUND) {
      const url = message.includes("/characters")
        ? ErrorCode.CHARACTER_NOT_FOUND
        : message.includes("/idioms")
          ? ErrorCode.IDIOM_NOT_FOUND
          : message.includes("/poems")
            ? ErrorCode.POEM_NOT_FOUND
            : ErrorCode.NOT_FOUND;
      return url;
    }

    // 400 错误根据消息判断
    if (status === HttpStatus.BAD_REQUEST) {
      if (message.includes("page")) return ErrorCode.INVALID_PAGE;
      if (message.includes("limit")) return ErrorCode.INVALID_LIMIT;
      if (message.includes("dynasty")) return ErrorCode.INVALID_DYNASTY;
      if (message.includes("search")) return ErrorCode.INVALID_SEARCH_KEYWORD;
      return ErrorCode.BAD_REQUEST;
    }

    return ErrorCode.INTERNAL_SERVER_ERROR;
  }
}
