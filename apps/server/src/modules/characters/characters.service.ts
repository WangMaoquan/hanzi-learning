import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CharacterTransformer } from "../../transformers";
import type { CharacterVO, PaginatedVO } from "../../transformers/vo";

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    page = 1,
    limit = 20,
    search?: string,
  ): Promise<PaginatedVO<CharacterVO>> {
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

    return CharacterTransformer.toPaginatedVO(data, total, page, limit);
  }

  async count(): Promise<number> {
    return this.prisma.character.count();
  }

  async findOne(id: string): Promise<CharacterVO | null> {
    const data = await this.prisma.character.findUnique({
      where: { id },
    });
    return data ? CharacterTransformer.toVO(data) : null;
  }

  async findByWord(word: string): Promise<CharacterVO | null> {
    const data = await this.prisma.character.findUnique({
      where: { word },
    });
    return data ? CharacterTransformer.toVO(data) : null;
  }

  async findRandom(): Promise<CharacterVO | null> {
    const count = await this.prisma.character.count();
    if (count === 0) return null;
    const random = Math.floor(Math.random() * count);
    const data = await this.prisma.character.findFirst({
      skip: random,
      take: 1,
    });
    return data ? CharacterTransformer.toVO(data) : null;
  }

  /**
   * 获取相邻的汉字（上一个和下一个）
   */
  async findNeighbors(
    id: string,
  ): Promise<{ prev: CharacterVO | null; next: CharacterVO | null }> {
    // 先获取当前汉字
    const current = await this.prisma.character.findUnique({
      where: { id },
    });

    if (!current) {
      return { prev: null, next: null };
    }

    // 获取上一个（word 字典序小于当前）
    const prev = await this.prisma.character.findFirst({
      where: {
        word: { lt: current.word },
      },
      orderBy: { word: "desc" },
    });

    // 获取下一个（word 字典序大于当前）
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
