import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class IdiomsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.idiom.findMany({
        skip,
        take: limit,
        orderBy: { word: "asc" },
      }),
      this.prisma.idiom.count(),
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
    return this.prisma.idiom.findUnique({
      where: { id },
    });
  }

  async findByWord(word: string) {
    return this.prisma.idiom.findUnique({
      where: { word },
    });
  }
}
