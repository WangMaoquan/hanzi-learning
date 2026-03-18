import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
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
        `Prisma Query: ${event.query} - ${event.duration}ms`,
        "PrismaService",
      );
    });

    await this.$connect();
    this.logger.log("Prisma connected", "PrismaService");
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log("Prisma disconnected", "PrismaService");
  }
}
