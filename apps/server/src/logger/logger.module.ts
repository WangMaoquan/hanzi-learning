import { Module } from "@nestjs/common";
import { LoggerModule as NestjsPinoLoggerModule } from "nestjs-pino";
import { randomUUID } from "crypto";

export const isProduction = process.env.NODE_ENV === "production";

@Module({
  imports: [
    NestjsPinoLoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || "info",
        // 禁用默认的 HTTP 请求日志，只使用自定义的拦截器日志
        autoLogging: false,
        transport: isProduction
          ? undefined
          : {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "HH:MM:ss",
                ignore: "pid,hostname,req,res",
              },
            },
        // 生成请求 ID
        genReqId: (req) => req.headers["x-request-id"] || randomUUID(),
        // 自定义序列化 - 完全隐藏 req/res
        serializers: {
          req() {
            return undefined;
          },
          res() {
            return undefined;
          },
        },
        // 生产环境输出到文件（可选）
        ...(isProduction &&
          {
            // 这里可以添加文件写入配置
            // 但推荐使用外部工具如 logrotate
          }),
      },
    }),
  ],
  exports: [NestjsPinoLoggerModule],
})
export class LoggerModule {}
