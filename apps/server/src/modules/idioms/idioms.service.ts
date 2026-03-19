import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { IdiomTransformer } from "../../transformers";
import type { IdiomVO, PaginatedVO } from "../../transformers/vo";

@Injectable()
export class IdiomsService {
  private readonly logger = new Logger(IdiomsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(
    page = 1,
    limit = 20,
    search?: string,
  ): Promise<PaginatedVO<IdiomVO>> {
    this.logger.debug(
      `Query idioms: page=${page}, limit=${limit}, search=${search}`,
      IdiomsService.name,
    );

    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { word: { contains: search } },
            { pinyin: { contains: search.toLowerCase() } },
            { explanation: { contains: search } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.idiom.findMany({
        where,
        skip,
        take: limit,
        orderBy: { word: "asc" },
      }),
      this.prisma.idiom.count({ where }),
    ]);

    this.logger.debug(
      `Idioms query completed: total=${total}, page=${page}, limit=${limit}`,
      IdiomsService.name,
    );
    return IdiomTransformer.toPaginatedVO(data, total, page, limit);
  }

  async count(): Promise<number> {
    return this.prisma.idiom.count();
  }

  async findOne(id: string): Promise<IdiomVO | null> {
    this.logger.debug(`Find idiom by id: ${id}`, IdiomsService.name);
    const data = await this.prisma.idiom.findUnique({
      where: { id },
    });
    return data ? IdiomTransformer.toVO(data) : null;
  }

  async findByWord(word: string): Promise<IdiomVO | null> {
    this.logger.debug(`Find idiom by word: ${word}`, IdiomsService.name);
    const data = await this.prisma.idiom.findUnique({
      where: { word },
    });
    return data ? IdiomTransformer.toVO(data) : null;
  }

  async findRandom(): Promise<IdiomVO | null> {
    this.logger.debug("Find random idiom", IdiomsService.name);
    const count = await this.prisma.idiom.count();
    if (count === 0) return null;
    const skip = Math.floor(Math.random() * count);
    const data = await this.prisma.idiom.findMany({
      skip,
      take: 1,
    });
    return data[0] ? IdiomTransformer.toVO(data[0]) : null;
  }

  async findNeighbors(
    id: string,
  ): Promise<{ prev: IdiomVO | null; next: IdiomVO | null }> {
    this.logger.debug(`Find idiom neighbors: ${id}`, IdiomsService.name);
    const current = await this.prisma.idiom.findUnique({ where: { id } });
    if (!current) {
      return { prev: null, next: null };
    }

    const prev = await this.prisma.idiom.findFirst({
      where: { word: { lt: current.word } },
      orderBy: { word: "desc" },
    });
    const next = await this.prisma.idiom.findFirst({
      where: { word: { gt: current.word } },
      orderBy: { word: "asc" },
    });

    return {
      prev: prev ? IdiomTransformer.toVO(prev) : null,
      next: next ? IdiomTransformer.toVO(next) : null,
    };
  }
}
