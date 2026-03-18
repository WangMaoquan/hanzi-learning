import { Controller, Get } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProduces,
} from "@nestjs/swagger";
import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
  PrismaHealthIndicator,
} from "@nestjs/terminus";
import { PrismaService } from "../../prisma/prisma.service";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({
    summary: "健康检查",
    description: "执行所有健康检查项，包括数据库连接",
  })
  @ApiProduces("application/json")
  @ApiResponse({ status: 200, description: "健康检查结果" })
  @ApiResponse({ status: 503, description: "服务不健康" })
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.prismaHealth.pingCheck("database", this.prisma),
    ]);
  }

  @Get("live")
  @ApiOperation({
    summary: "存活检查",
    description: "简单的存活探测，用于 k8s livenessProbe",
  })
  @ApiProduces("text/plain")
  @ApiResponse({ status: 200, description: "返回 OK", type: String })
  liveness(): string {
    return "OK";
  }

  @Get("ready")
  @ApiOperation({
    summary: "就绪检查",
    description: "检查服务是否准备好接受流量，包括数据库连接",
  })
  @ApiProduces("application/json")
  @ApiResponse({ status: 200, description: "服务就绪" })
  @ApiResponse({ status: 503, description: "服务未就绪" })
  async readiness(): Promise<{ status: string; database: boolean }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "UP", database: true };
    } catch {
      return { status: "DOWN", database: false };
    }
  }
}
