import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

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
  private readonly logger = new Logger(SuccessInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    return next.handle().pipe(
      map((data) => {
        this.logger.log(`${method} ${url} - Success`);
        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
