import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";

const isProduction = process.env.NODE_ENV === "production";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly context = "PrismaService";

  constructor() {
    super({
      log: isProduction
        ? [
            { level: "error", emit: "stdout" as const },
            { level: "warn", emit: "stdout" as const },
          ]
        : [
            { level: "query", emit: "event" as const },
            { level: "error", emit: "stdout" as const },
            { level: "warn", emit: "stdout" as const },
          ],
    });
  }

  async onModuleInit() {
    // 开发环境监听查询事件
    if (!isProduction) {
      this.$on("query" as never, (event: Prisma.QueryEvent) => {
        this.logger.log(
          `SQL: ${event.query} | ${event.duration}ms`,
          this.context,
        );
      });
    }

    await this.$connect();
    this.logger.log("Prisma connected", this.context);
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log("Prisma disconnected", this.context);
  }
}
