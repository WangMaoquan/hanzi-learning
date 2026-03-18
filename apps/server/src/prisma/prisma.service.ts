import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { PinoLogger, InjectPinoLogger } from "nestjs-pino";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(@InjectPinoLogger() private logger: PinoLogger) {
    super({
      log: [
        { level: "query", emit: "event" },
        { level: "error", emit: "stdout" },
        { level: "warn", emit: "stdout" },
      ],
    });
  }

  async onModuleInit() {
    // 监听查询事件
    this.$on("query" as never, (event: Prisma.QueryEvent) => {
      this.logger.debug(
        {
          query: event.query,
          duration: `${event.duration}ms`,
          params: event.params,
        },
        "Prisma Query",
      );
    });

    await this.$connect();
    this.logger.info("Prisma connected");
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.info("Prisma disconnected");
  }
}
