import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PoemsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, dynasty?: string, author?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (dynasty) {
      where.dynasty = dynasty;
    }
    if (author) {
      where.author = { contains: author };
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
}
