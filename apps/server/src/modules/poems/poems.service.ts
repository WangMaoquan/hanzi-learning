import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PoemsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, dynasty?: string, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

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

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async count() {
    return this.prisma.poem.count();
  }

  async findOne(id: string) {
    return this.prisma.poem.findUnique({
      where: { id },
    });
  }

  async findByTitle(title: string) {
    return this.prisma.poem.findFirst({
      where: { title },
    });
  }

  async findRandom() {
    const count = await this.prisma.poem.count();
    if (count === 0) return null;
    const random = Math.floor(Math.random() * count);
    return this.prisma.poem.findFirst({
      skip: random,
      take: 1,
    });
  }
}
