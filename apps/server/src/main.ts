import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import compression from "compression";
import { AppModule } from "./app.module";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import { SuccessInterceptor } from "./interceptors/success.interceptor";
import { HttpExceptionFilter } from "./filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const configService = app.get(ConfigService);

  // 启用响应压缩
  app.use(compression());

  // 使用 Winston Logger 作为 NestJS 日志
  const winstonLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
          }),
        ),
      }),
    ],
  });

  app.useLogger(winstonLogger);

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
      transform: true, // 自动将请求体转换为 DTO 实例
      whitelist: true, // 剥离未在 DTO 中定义的属性
      forbidNonWhitelisted: true, // 如果有未定义的属性抛出错误
    }),
  );

  // Swagger API 文档配置
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

  // 从配置获取端口
  const port = configService.get<number>("app.port") || 3001;
  await app.listen(port);
  winstonLogger.info(`API server running on http://localhost:${port}`);
  winstonLogger.info(
    `Swagger docs available at http://localhost:${port}/api/docs`,
  );
}

bootstrap();
