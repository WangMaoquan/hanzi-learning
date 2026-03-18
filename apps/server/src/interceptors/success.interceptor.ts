import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { PinoLogger, InjectPinoLogger } from "nestjs-pino";

export interface Response<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

/**
 * 统一成功响应拦截器
 * 将所有响应包装为 { success: true, data: ..., timestamp: ... }
 */
@Injectable()
export class SuccessInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(
    @InjectPinoLogger()
    private readonly logger: PinoLogger,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const method = request.method;
    const url = request.url;
    const startTime = Date.now();

    return next.handle().pipe(
      map((data) => {
        const responseTime = Date.now() - startTime;
        this.logger.info(
          {
            method,
            url,
            statusCode: response.statusCode,
            responseTime,
            ip: request.ip || request.headers["x-forwarded-for"],
          },
          "HTTP Request",
        );

        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
