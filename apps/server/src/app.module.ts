import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";
import { CacheModule, CacheInterceptor } from "@nestjs/cache-manager";
import { LoggerModule } from "./logger/logger.module";
import { CharactersModule } from "./modules/characters/characters.module";
import { IdiomsModule } from "./modules/idioms/idioms.module";
import { PoemsModule } from "./modules/poems/poems.module";
import { HealthModule } from "./modules/health/health.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SuccessInterceptor } from "./interceptors/success.interceptor";
import { HttpExceptionFilter } from "./filters/http-exception.filter";

@Module({
  imports: [
    LoggerModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000, // 默认缓存 1 分钟
    }),
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
    PrismaModule,
    CharactersModule,
    IdiomsModule,
    PoemsModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
