import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, search?: string) {
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

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async count() {
    return this.prisma.character.count();
  }

  async findOne(id: string) {
    return this.prisma.character.findUnique({
      where: { id },
    });
  }

  async findByWord(word: string) {
    return this.prisma.character.findUnique({
      where: { word },
    });
  }

  async findRandom() {
    const count = await this.prisma.character.count();
    if (count === 0) return null;
    const random = Math.floor(Math.random() * count);
    return this.prisma.character.findFirst({
      skip: random,
      take: 1,
    });
  }
}
