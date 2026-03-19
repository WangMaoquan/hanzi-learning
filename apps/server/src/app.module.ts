import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { CacheModule } from "@nestjs/cache-manager";
import { LoggerModule } from "./logger/logger.module";
import { CharactersModule } from "./modules/characters/characters.module";
import { IdiomsModule } from "./modules/idioms/idioms.module";
import { PoemsModule } from "./modules/poems/poems.module";
import { HealthModule } from "./modules/health/health.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SuccessInterceptor } from "./interceptors/success.interceptor";
import { LoggingInterceptor } from "./interceptors/logging.interceptor";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import {
  appConfig,
  cacheConfig,
  throttleConfig,
  LoggingConfig,
} from "./config/app.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, cacheConfig, throttleConfig, LoggingConfig],
    }),
    LoggerModule,
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<number>("cache.ttl") || 60000,
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          name: "short",
          ttl: config.get<number>("throttle.short.ttl") || 1000,
          limit: config.get<number>("throttle.short.limit") || 10,
        },
        {
          name: "medium",
          ttl: config.get<number>("throttle.medium.ttl") || 10000,
          limit: config.get<number>("throttle.medium.limit") || 50,
        },
        {
          name: "long",
          ttl: config.get<number>("throttle.long.ttl") || 60000,
          limit: config.get<number>("throttle.long.limit") || 200,
        },
      ],
    }),
    PrismaModule,
    CharactersModule,
    IdiomsModule,
    PoemsModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessInterceptor,
    },
    // 日志拦截器（使用 useClass 无法注入 ConfigService，改为 useFactory）
    {
      provide: APP_INTERCEPTOR,
      useFactory: (configService: ConfigService) => {
        return new LoggingInterceptor(configService);
      },
      inject: [ConfigService],
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
