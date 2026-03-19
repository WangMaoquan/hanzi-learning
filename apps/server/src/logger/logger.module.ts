import { Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";

// Winston 日志格式
const winstonFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

// 开发环境彩色格式
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `${timestamp} ${context ? `[${context}] ` : ""}${level}: ${message} ${metaStr}`;
  }),
);

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        // 控制台输出
        new winston.transports.Console({
          level: process.env.LOG_LEVEL || "info",
          format:
            process.env.NODE_ENV === "production" ? winstonFormat : devFormat,
        }),
        // 生产环境文件输出
        ...(process.env.NODE_ENV === "production"
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
