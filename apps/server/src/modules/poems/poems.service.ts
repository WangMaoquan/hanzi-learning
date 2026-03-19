import { Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { PoemTransformer } from "../../transformers";
import type { PoemVO, PaginatedVO } from "../../transformers/vo";

@Injectable()
export class PoemsService {
  private readonly logger = new Logger(PoemsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(
    page = 1,
    limit = 20,
    dynasty?: string,
    search?: string,
  ): Promise<PaginatedVO<PoemVO>> {
    this.logger.debug(
      `Query poems: page=${page}, limit=${limit}, dynasty=${dynasty}, search=${search}`,
      PoemsService.name,
    );

    const skip = (page - 1) * limit;
    const where: Prisma.PoemWhereInput = {};

    if (dynasty) {
      where.dynasty = dynasty;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { author: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.poem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { title: "asc" },
      }),
      this.prisma.poem.count({ where }),
    ]);

    this.logger.debug(
      `Poems query completed: total=${total}, page=${page}, limit=${limit}`,
      PoemsService.name,
    );
    return PoemTransformer.toPaginatedVO(data, total, page, limit);
  }

  async count(): Promise<number> {
    return this.prisma.poem.count();
  }

  async findOne(id: string): Promise<PoemVO | null> {
    this.logger.debug(`Find poem by id: ${id}`, PoemsService.name);
    const data = await this.prisma.poem.findUnique({
      where: { id },
    });
    return data ? PoemTransformer.toVO(data) : null;
  }

  async findByTitle(title: string): Promise<PoemVO | null> {
    this.logger.debug(`Find poem by title: ${title}`, PoemsService.name);
    const data = await this.prisma.poem.findFirst({
      where: { title },
    });
    return data ? PoemTransformer.toVO(data) : null;
  }

  async findRandom(): Promise<PoemVO | null> {
    this.logger.debug("Find random poem", PoemsService.name);
    const count = await this.prisma.poem.count();
    if (count === 0) return null;
    const skip = Math.floor(Math.random() * count);
    const data = await this.prisma.poem.findMany({
      skip,
      take: 1,
    });
    return data[0] ? PoemTransformer.toVO(data[0]) : null;
  }

  async findNeighbors(
    id: string,
  ): Promise<{ prev: PoemVO | null; next: PoemVO | null }> {
    this.logger.debug(`Find poem neighbors: ${id}`, PoemsService.name);
    const current = await this.prisma.poem.findUnique({ where: { id } });
    if (!current) {
      return { prev: null, next: null };
    }

    const prev = await this.prisma.poem.findFirst({
      where: { title: { lt: current.title } },
      orderBy: { title: "desc" },
    });
    const next = await this.prisma.poem.findFirst({
      where: { title: { gt: current.title } },
      orderBy: { title: "asc" },
    });

    return {
      prev: prev ? PoemTransformer.toVO(prev) : null,
      next: next ? PoemTransformer.toVO(next) : null,
    };
  }
}
