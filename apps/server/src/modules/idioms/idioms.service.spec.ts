import { Test, TestingModule } from "@nestjs/testing";
import { IdiomsService } from "./idioms.service";
import { PrismaService } from "../../prisma/prisma.service";
import { LoggerModule } from "../../logger/logger.module";

describe("IdiomsService", () => {
  let service: IdiomsService;
  let prismaService: Partial<PrismaService>;

  const mockIdioms = [
    {
      id: "1",
      word: "一心一意",
      pinyin: "yī xīn yī yì",
      explanation: "只有一个心思，形容专心致志",
      difficulty: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      word: "二话不说",
      pinyin: "èr huà bù shuō",
      explanation: "不说任何话，形容立即行动",
      difficulty: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    prismaService = {
      idiom: {
        findMany: jest.fn().mockResolvedValue(mockIdioms),
        count: jest.fn().mockResolvedValue(2),
        findUnique: jest.fn().mockResolvedValue(mockIdioms[0]),
        findFirst: jest.fn().mockResolvedValue(mockIdioms[1]),
      },
    } as unknown as Partial<PrismaService>;

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        IdiomsService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<IdiomsService>(IdiomsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return paginated idioms", async () => {
      const result = await service.findAll();

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("total");
      expect(result.total).toBe(2);
    });

    it("should apply search filter", async () => {
      await service.findAll(1, 20, "一心");

      expect(prismaService.idiom!.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ word: { contains: "一心" } }),
            ]),
          }),
        }),
      );
    });
  });

  describe("findOne", () => {
    it("should return an idiom by id", async () => {
      const result = await service.findOne("1");

      expect(result).toBeDefined();
      expect(prismaService.idiom!.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should return null if idiom not found", async () => {
      (prismaService.idiom!.findUnique as jest.Mock).mockResolvedValueOnce(
        null,
      );
      const result = await service.findOne("999");

      expect(result).toBeNull();
    });
  });

  describe("findByWord", () => {
    it("should return an idiom by word", async () => {
      const result = await service.findByWord("一心一意");

      expect(result).toBeDefined();
      expect(prismaService.idiom!.findUnique).toHaveBeenCalledWith({
        where: { word: "一心一意" },
      });
    });
  });

  describe("findRandom", () => {
    it("should return a random idiom", async () => {
      const result = await service.findRandom();

      expect(result).toBeDefined();
    });

    it("should return null if no idioms exist", async () => {
      (prismaService.idiom!.count as jest.Mock).mockResolvedValueOnce(0);
      const result = await service.findRandom();

      expect(result).toBeNull();
    });
  });

  describe("findNeighbors", () => {
    it("should return neighbors for an idiom", async () => {
      const result = await service.findNeighbors("1");

      expect(result).toHaveProperty("prev");
      expect(result).toHaveProperty("next");
    });

    it("should return null neighbors if idiom not found", async () => {
      (prismaService.idiom!.findUnique as jest.Mock).mockResolvedValueOnce(
        null,
      );
      const result = await service.findNeighbors("999");

      expect(result.prev).toBeNull();
      expect(result.next).toBeNull();
    });
  });

  describe("count", () => {
    it("should return total count", async () => {
      const result = await service.count();

      expect(result).toBe(2);
    });
  });
});
