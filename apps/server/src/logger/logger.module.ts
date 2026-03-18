import { Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";

export const isProduction = process.env.NODE_ENV === "production";

// Winston 日志格式
const winstonFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        // 控制台输出
        new winston.transports.Console({
          level: process.env.LOG_LEVEL || "info",
          format: isProduction
            ? winstonFormat
            : winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: "HH:mm:ss" }),
                winston.format.printf(
                  ({ timestamp, level, message, context, ...meta }) => {
                    const metaStr = Object.keys(meta).length
                      ? JSON.stringify(meta)
                      : "";
                    return `${timestamp} ${context ? `[${context}] ` : ""}${level}: ${message} ${metaStr}`;
                  },
                ),
              ),
        }),
        // 生产环境可以添加文件输出
        ...(isProduction
          ? [
              new winston.transports.File({
                filename: "logs/error.log",
                level: "error",
                format: winstonFormat,
              }),
              new winston.transports.File({
                filename: "logs/combined.log",
                format: winstonFormat,
              }),
            ]
          : []),
      ],
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
