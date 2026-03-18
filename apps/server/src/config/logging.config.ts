import { registerAs } from "@nestjs/config";

export const LoggingConfig = registerAs("logging", () => ({
  // 是否启用详细控制台日志（生产环境默认关闭）
  enableDetailedLogs:
    process.env.LOG_ENABLE_DETAILED !== "false" &&
    process.env.NODE_ENV !== "production",

  // 请求/响应日志
  logRequestBody: process.env.LOG_REQUEST_BODY !== "false",
  logResponseBody: process.env.LOG_RESPONSE_BODY !== "false",
  maxResponseBodyLength: parseInt(process.env.LOG_MAX_BODY_LENGTH || "500", 10),

  // 查询和路由参数
  logQueryParams: process.env.LOG_QUERY_PARAMS !== "false",
  logRouteParams: process.env.LOG_ROUTE_PARAMS !== "false",

  // 用户信息
  logUserInfo: process.env.LOG_USER_INFO !== "false",
  logIpAddress: process.env.LOG_IP_ADDRESS !== "false",
  logUserAgent: process.env.LOG_USER_AGENT !== "false",

  // 敏感字段（自动脱敏）
  sensitiveFields: [
    "password",
    "token",
    "secret",
    "apiKey",
    "accessToken",
    "refreshToken",
    "secretKey",
  ],

  // 忽略日志的路径
  ignoredPaths: [/\/health$/, /\/favicon\.ico$/, /\/api\/docs/, /\/api$/],

  // 慢请求阈值（毫秒）
  slowRequestThreshold: parseInt(
    process.env.SLOW_REQUEST_THRESHOLD || "500",
    10,
  ),
}));
