import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import compression from "compression";
import { AppModule } from "./app.module";
import * as winston from "winston";

// 开发环境彩色格式
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, context }) => {
    const ctx = context ? `[${context}] ` : "";
    return `${timestamp} ${level}: ${ctx}${message}`;
  }),
);

// 生产环境 JSON 格式
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// 创建 Winston Logger
const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: process.env.NODE_ENV === "production" ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === "production" ? prodFormat : devFormat,
    }),
    // 生产环境文件输出
    ...(process.env.NODE_ENV === "production"
      ? [
          new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
            format: prodFormat,
          }),
          new winston.transports.File({
            filename: "logs/combined.log",
            format: prodFormat,
          }),
        ]
      : []),
  ],
});

// 创建适配器，将所有日志级别映射到 Winston
// NestJS Logger: log(message, context), error(message, trace, context)
const loggerAdapter = {
  debug: (message: string) => winstonLogger.debug(message),
  verbose: (message: string) => winstonLogger.verbose(message),
  log: (message: string, context?: string) => {
    if (context) {
      winstonLogger.info(message, { context });
    } else {
      winstonLogger.info(message);
    }
  },
  info: (message: string, context?: string) => {
    if (context) {
      winstonLogger.info(message, { context });
    } else {
      winstonLogger.info(message);
    }
  },
  warn: (message: string, context?: string) => {
    if (context) {
      winstonLogger.warn(message, { context });
    } else {
      winstonLogger.warn(message);
    }
  },
  error: (message: string, trace?: string, context?: string) => {
    if (context || trace) {
      winstonLogger.error(message, { trace, context });
    } else {
      winstonLogger.error(message);
    }
  },
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: loggerAdapter });
  const configService = app.get(ConfigService);

  // 启用响应压缩
  app.use(compression());

  // 全局路由前缀
  app.setGlobalPrefix("api/v1");

  // CORS 配置 - 从环境变量读取
  const allowedOrigins = configService.get<string[]>("app.allowedOrigins") || [
    "http://localhost:3000",
  ];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // 全局验证管道 - 自动验证 DTO 并转换类型
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger API 文档配置
  // Swagger 仅在开发环境启用
  if (process.env.NODE_ENV !== "production") {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("汉字学习平台 API")
      .setDescription(
        "趣味学习中华文化的在线平台 API 文档\n\n" +
          "提供汉字、成语、古诗的查询接口\n\n" +
          "### 功能说明\n" +
          "- 汉字：查询汉字的拼音、笔画、释义等\n" +
          "- 成语：查询成语的拼音、解释、出处、典故等\n" +
          "- 古诗：查询古诗的作者、朝代、内容、赏析等\n\n" +
          "### 认证说明\n" +
          "当前接口无需认证，直接调用即可",
      )
      .setVersion("1.0")
      .setContact("decade", "https://github.com/decade", "1782976211@qq.com")
      .addTag("characters", "汉字相关接口 - 查询汉字的拼音、笔画、释义等")
      .addTag("idioms", "成语相关接口 - 查询成语的拼音、解释、出处、典故等")
      .addTag("poems", "古诗相关接口 - 查询古诗的作者、朝代、内容、赏析等")
      .addTag("health", "健康检查接口 - 服务健康状态探测")
      .addServer("/api/v1", "生产环境")
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api/docs", app, document);
  }

  // 从配置获取端口
  const port = configService.get<number>("app.port") || 3001;
  await app.listen(port);
  winstonLogger.info(`API server running on http://localhost:${port}`);
  winstonLogger.info(
    `Swagger docs available at http://localhost:${port}/api/docs`,
  );
}

bootstrap();
// test hook
