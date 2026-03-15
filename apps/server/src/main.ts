import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ThrottlerModule } from "@nestjs/throttler";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import { SuccessInterceptor } from "./interceptors/success.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局路由前缀
  app.setGlobalPrefix("api/v1");

  // 速率限制配置
  app.use(
    ThrottlerModule.forRoot([
      {
        name: "short",
        ttl: 1000, // 1秒
        limit: 10, // 最多10个请求
      },
      {
        name: "medium",
        ttl: 10000, // 10秒
        limit: 50, // 最多50个请求
      },
      {
        name: "long",
        ttl: 60000, // 1分钟
        limit: 200, // 最多200个请求
      },
    ]),
  );

  // CORS 配置
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
    ],
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

  // 全局响应拦截器 - 统一响应格式
  app.useGlobalInterceptors(new SuccessInterceptor());

  // 全局异常过滤器 - 统一错误响应
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger API 文档配置
  const config = new DocumentBuilder()
    .setTitle("汉字学习平台 API")
    .setDescription("趣味学习中华文化的在线平台 API 文档")
    .setVersion("1.0")
    .addTag("characters", "汉字相关接口")
    .addTag("idioms", "成语相关接口")
    .addTag("poems", "古诗相关接口")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(3001);
  console.log("API server running on http://localhost:3001");
  console.log("Swagger docs available at http://localhost:3001/api/docs");
}

bootstrap();
