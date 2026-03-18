import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { Logger } from "nestjs-pino";
import { SuccessInterceptor } from "./interceptors/success.interceptor";
import { HttpExceptionFilter } from "./filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const configService = app.get(ConfigService);

  // 使用 Pino 作为全局日志
  app.useLogger(app.get(Logger));

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
    .setDescription("趣味学习中华文化的在线平台 API 文档")
    .setVersion("1.0")
    .addTag("characters", "汉字相关接口")
    .addTag("idioms", "成语相关接口")
    .addTag("poems", "古诗相关接口")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document);

  // 从配置获取端口
  const port = configService.get<number>("app.port") || 3001;
  await app.listen(port);
  const logger = app.get(Logger);
  logger.log(`API server running on http://localhost:${port}`);
  logger.log(`Swagger docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
