import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CharacterTransformer } from "../../transformers";
import type { CharacterVO, PaginatedVO } from "../../transformers/vo";
import { PinoLogger, InjectPinoLogger } from "nestjs-pino";

@Injectable()
export class CharactersService {
  constructor(
    private prisma: PrismaService,
    @InjectPinoLogger() private logger: PinoLogger,
  ) {}

  async findAll(
    page = 1,
    limit = 20,
    search?: string,
  ): Promise<PaginatedVO<CharacterVO>> {
    this.logger.debug({ page, limit, search }, "Query characters");

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
      this.prisma.character.findMany({
        where,
        skip,
        take: limit,
        orderBy: { word: "asc" },
      }),
      this.prisma.character.count({ where }),
    ]);

    this.logger.debug({ total, page, limit }, "Characters query completed");
    return CharacterTransformer.toPaginatedVO(data, total, page, limit);
  }

  async count(): Promise<number> {
    return this.prisma.character.count();
  }

  async findOne(id: string): Promise<CharacterVO | null> {
    this.logger.debug({ id }, "Find character by id");
    const data = await this.prisma.character.findUnique({
      where: { id },
    });
    return data ? CharacterTransformer.toVO(data) : null;
  }

  async findByWord(word: string): Promise<CharacterVO | null> {
    this.logger.debug({ word }, "Find character by word");
    const data = await this.prisma.character.findUnique({
      where: { word },
    });
    return data ? CharacterTransformer.toVO(data) : null;
  }

  async findRandom(): Promise<CharacterVO | null> {
    // 随机查询不缓存
    this.logger.debug({}, "Find random character");
    const count = await this.prisma.character.count();
    if (count === 0) return null;
    const random = Math.floor(Math.random() * count);
    const data = await this.prisma.character.findFirst({
      skip: random,
      take: 1,
    });
    return data ? CharacterTransformer.toVO(data) : null;
  }

  async findNeighbors(
    id: string,
  ): Promise<{ prev: CharacterVO | null; next: CharacterVO | null }> {
    this.logger.debug({ id }, "Find character neighbors");
    const current = await this.prisma.character.findUnique({
      where: { id },
    });

    if (!current) {
      return { prev: null, next: null };
    }

    const prev = await this.prisma.character.findFirst({
      where: {
        word: { lt: current.word },
      },
      orderBy: { word: "desc" },
    });

    const next = await this.prisma.character.findFirst({
      where: {
        word: { gt: current.word },
      },
      orderBy: { word: "asc" },
    });

    return {
      prev: prev ? CharacterTransformer.toVO(prev) : null,
      next: next ? CharacterTransformer.toVO(next) : null,
    };
  }
}
