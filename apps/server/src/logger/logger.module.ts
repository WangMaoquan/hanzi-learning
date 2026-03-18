import { Module } from "@nestjs/common";
import { LoggerModule as NestjsPinoLoggerModule } from "nestjs-pino";
import { randomUUID } from "crypto";

export const isProduction = process.env.NODE_ENV === "production";

@Module({
  imports: [
    NestjsPinoLoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || "info",
        transport: isProduction
          ? undefined
          : {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname",
              },
            },
        // 生成请求 ID
        genReqId: (req) => req.headers["x-request-id"] || randomUUID(),
        // 自定义序列化
        serializers: {
          req(req) {
            return {
              id: req.id,
              method: req.method,
              url: req.url,
              headers: {
                host: req.headers.host,
                "user-agent": req.headers["user-agent"],
              },
            };
          },
          res(res) {
            return {
              statusCode: res.statusCode,
            };
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
