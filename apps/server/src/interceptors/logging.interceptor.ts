import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";

/**
 * 日志拦截器 - 控制详细日志输出
 *
 * 功能：
 * 1. 请求/响应日志（可配置详细程度）
 * 2. 敏感字段脱敏
 * 3. 忽略特定路径
 * 4. 慢请求告警
 * 5. 统一响应包装
 *
 * 日志字段：
 * - requestId: 请求唯一标识
 * - responseTime: 响应时间
 * - responseSize: 响应体大小
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  private readonly context = "LoggingInterceptor";

  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // 生成请求 ID
    const requestId =
      (request.headers["x-request-id"] as string) || randomUUID();
    request.headers["x-request-id"] = requestId;

    // 检查是否忽略此路径
    if (this.shouldIgnore(request.url)) {
      return next.handle();
    }

    // 获取配置
    const enableDetailedLogs =
      this.configService.get<boolean>("logging.enableDetailedLogs") ?? true;
    const slowRequestThreshold =
      this.configService.get<number>("logging.slowRequestThreshold") ?? 500;

    const method = request.method;
    const url = request.url;
    const startTime = Date.now();

    // 详细日志模式
    if (enableDetailedLogs) {
      this.logRequest(request, requestId);
    }

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - startTime;
          const statusCode = response.statusCode;

          if (enableDetailedLogs) {
            this.logResponse(
              method,
              url,
              statusCode,
              responseTime,
              slowRequestThreshold,
              requestId,
            );
          } else {
            // 简化日志
            const level = responseTime > slowRequestThreshold ? "warn" : "log";
            this.logger[level](
              `${method} ${url} - ${statusCode} - ${responseTime}ms [reqId=${requestId}]`,
              this.context,
            );
          }
        },
        error: (error: Error) => {
          const responseTime = Date.now() - startTime;
          this.logger.error(
            `${method} ${url} - Error: ${error.message} - ${responseTime}ms [reqId=${requestId}]`,
            error.stack,
            this.context,
          );
        },
      }),
    );
  }

  /**
   * 判断是否忽略此路径
   */
  private shouldIgnore(url: string): boolean {
    const ignoredPaths = this.configService.get<Array<string | RegExp>>(
      "logging.ignoredPaths",
    ) || [/\/health$/, /\/favicon\.ico$/, /\/api\/docs/];

    return ignoredPaths.some((pattern) => {
      if (typeof pattern === "string") {
        return url === pattern || url.startsWith(pattern);
      }
      return pattern.test(url);
    });
  }

  /**
   * 打印请求日志
   */
  private logRequest(
    request: {
      method: string;
      url: string;
      query: Record<string, unknown>;
      params: Record<string, unknown>;
      body: unknown;
      headers: Record<string, unknown>;
      ip: string;
      user?: unknown;
    },
    requestId: string,
  ): void {
    const logQueryParams =
      this.configService.get<boolean>("logging.logQueryParams") ?? true;
    const logRouteParams =
      this.configService.get<boolean>("logging.logRouteParams") ?? true;
    const logRequestBody =
      this.configService.get<boolean>("logging.logRequestBody") ?? true;
    const logIpAddress =
      this.configService.get<boolean>("logging.logIpAddress") ?? true;
    const logUserAgent =
      this.configService.get<boolean>("logging.logUserAgent") ?? true;

    const parts: string[] = [];

    // HTTP 方法（带颜色）
    const methodColors: Record<string, string> = {
      GET: "\x1b[32m",
      POST: "\x1b[33m",
      PUT: "\x1b[34m",
      PATCH: "\x1b[35m",
      DELETE: "\x1b[31m",
    };
    const color = methodColors[request.method] || "\x1b[0m";
    parts.push(
      `${color}${request.method}\x1b[0m ${request.url} [reqId=${requestId}]`,
    );

    // 查询参数
    if (logQueryParams && Object.keys(request.query).length > 0) {
      parts.push(`\n  Query: ${JSON.stringify(request.query)}`);
    }

    // 路由参数
    if (logRouteParams && Object.keys(request.params).length > 0) {
      parts.push(`\n  Params: ${JSON.stringify(request.params)}`);
    }

    // 请求体
    if (
      logRequestBody &&
      request.body &&
      Object.keys(request.body).length > 0
    ) {
      const sanitizedBody = this.sanitizeBody(request.body);
      parts.push(`\n  Body: ${JSON.stringify(sanitizedBody)}`);
    }

    // IP 地址
    if (logIpAddress && request.ip) {
      parts.push(`\n  IP: ${request.ip}`);
    }

    // User-Agent
    if (logUserAgent && request.headers["user-agent"]) {
      parts.push(`\n  UA: ${request.headers["user-agent"]}`);
    }

    this.logger.log(parts.join(""), this.context);
  }

  /**
   * 打印响应日志
   */
  private logResponse(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    slowRequestThreshold: number,
    requestId: string,
  ): void {
    // 状态码颜色
    let statusColor = "\x1b[0m";
    if (statusCode >= 200 && statusCode < 300)
      statusColor = "\x1b[32m"; // 绿色
    else if (statusCode >= 300 && statusCode < 400)
      statusColor = "\x1b[36m"; // 青色
    else if (statusCode >= 400 && statusCode < 500)
      statusColor = "\x1b[33m"; // 黄色
    else if (statusCode >= 500) statusColor = "\x1b[31m"; // 红色

    // 响应时间颜色
    let timeColor = "\x1b[32m"; // 绿色 - 快
    if (responseTime >= slowRequestThreshold)
      timeColor = "\x1b[31m"; // 红色 - 慢
    else if (responseTime >= 200) timeColor = "\x1b[33m"; // 黄色 - 中等

    const timeStr = `${timeColor}${responseTime}ms\x1b[0m`;
    const statusStr = `${statusColor}${statusCode}\x1b[0m`;

    this.logger.log(
      `${method} ${url} - ${statusStr} - ${timeStr} [reqId=${requestId}]`,
      this.context,
    );
  }

  /**
   * 脱敏处理请求体
   */
  private sanitizeBody(body: unknown): unknown {
    if (!body || typeof body !== "object") {
      return body;
    }

    const sensitiveFields = this.configService.get<string[]>(
      "logging.sensitiveFields",
    ) || [
      "password",
      "token",
      "secret",
      "apiKey",
      "accessToken",
      "refreshToken",
      "secretKey",
    ];

    const sanitized = { ...body } as Record<string, unknown>;

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = "***REDACTED***";
      }
    }

    return sanitized;
  }
}
