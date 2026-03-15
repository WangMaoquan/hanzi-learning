import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { CharactersModule } from "./modules/characters/characters.module";
import { IdiomsModule } from "./modules/idioms/idioms.module";
import { PoemsModule } from "./modules/poems/poems.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
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
  ],
})
export class AppModule {}
