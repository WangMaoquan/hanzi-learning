import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { IdiomTransformer } from "../../transformers";
import type { IdiomVO, PaginatedVO } from "../../transformers/vo";

@Injectable()
export class IdiomsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    page = 1,
    limit = 20,
    search?: string,
  ): Promise<PaginatedVO<IdiomVO>> {
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

    return IdiomTransformer.toPaginatedVO(data, total, page, limit);
  }

  async count(): Promise<number> {
    return this.prisma.idiom.count();
  }

  async findOne(id: string): Promise<IdiomVO | null> {
    const data = await this.prisma.idiom.findUnique({
      where: { id },
    });
    return data ? IdiomTransformer.toVO(data) : null;
  }

  async findByWord(word: string): Promise<IdiomVO | null> {
    const data = await this.prisma.idiom.findUnique({
      where: { word },
    });
    return data ? IdiomTransformer.toVO(data) : null;
  }

  async findRandom(): Promise<IdiomVO | null> {
    const count = await this.prisma.idiom.count();
    if (count === 0) return null;
    const random = Math.floor(Math.random() * count);
    const data = await this.prisma.idiom.findFirst({
      skip: random,
      take: 1,
    });
    return data ? IdiomTransformer.toVO(data) : null;
  }
}
