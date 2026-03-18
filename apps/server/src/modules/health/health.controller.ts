import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
  PrismaHealthIndicator,
} from "@nestjs/terminus";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.prismaHealth.pingCheck("database", this.prisma),
    ]);
  }

  @Get("live")
  liveness(): string {
    return "OK";
  }

  @Get("ready")
  async readiness(): Promise<{ status: string; database: boolean }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "UP", database: true };
    } catch {
      return { status: "DOWN", database: false };
    }
  }
}
