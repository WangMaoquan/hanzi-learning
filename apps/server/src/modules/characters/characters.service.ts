import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CharacterTransformer } from "../../transformers";
import type { CharacterVO, PaginatedVO } from "../../transformers/vo";

@Injectable()
export class CharactersService {
  private readonly logger = new Logger(CharactersService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(
    page = 1,
    limit = 20,
    search?: string,
  ): Promise<PaginatedVO<CharacterVO>> {
    this.logger.debug(
      `Query characters: page=${page}, limit=${limit}, search=${search}`,
      CharactersService.name,
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
      this.prisma.character.findMany({
        where,
        skip,
        take: limit,
        orderBy: { word: "asc" },
      }),
      this.prisma.character.count({ where }),
    ]);

    this.logger.debug(
      `Characters query completed: total=${total}, page=${page}, limit=${limit}`,
      CharactersService.name,
    );
    return CharacterTransformer.toPaginatedVO(data, total, page, limit);
  }

  async count(): Promise<number> {
    return this.prisma.character.count();
  }

  async findOne(id: string): Promise<CharacterVO | null> {
    this.logger.debug(`Find character by id: ${id}`, CharactersService.name);
    const data = await this.prisma.character.findUnique({
      where: { id },
    });
    return data ? CharacterTransformer.toVO(data) : null;
  }

  async findByWord(word: string): Promise<CharacterVO | null> {
    this.logger.debug(
      `Find character by word: ${word}`,
      CharactersService.name,
    );
    const data = await this.prisma.character.findUnique({
      where: { word },
    });
    return data ? CharacterTransformer.toVO(data) : null;
  }

  async findRandom(): Promise<CharacterVO | null> {
    // 随机查询不缓存
    this.logger.debug("Find random character", CharactersService.name);
    const count = await this.prisma.character.count();
    if (count === 0) return null;
    const skip = Math.floor(Math.random() * count);
    const data = await this.prisma.character.findMany({
      skip,
      take: 1,
    });
    return data[0] ? CharacterTransformer.toVO(data[0]) : null;
  }

  async findNeighbors(
    id: string,
  ): Promise<{ prev: CharacterVO | null; next: CharacterVO | null }> {
    this.logger.debug(
      `Find character neighbors: ${id}`,
      CharactersService.name,
    );
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
