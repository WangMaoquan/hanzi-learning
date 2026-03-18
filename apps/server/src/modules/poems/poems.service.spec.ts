import { Test, TestingModule } from "@nestjs/testing";
import { PoemsService } from "./poems.service";
import { PrismaService } from "../../prisma/prisma.service";
import { LoggerModule } from "../../logger/logger.module";

describe("PoemsService", () => {
  let service: PoemsService;
  let prismaService: Partial<PrismaService>;

  const mockPoems = [
    {
      id: "1",
      title: "静夜思",
      author: "李白",
      dynasty: "唐",
      content: "床前明月光，疑是地上霜",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "春晓",
      author: "孟浩然",
      dynasty: "唐",
      content: "春眠不觉晓，处处闻啼鸟",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    prismaService = {
      poem: {
        findMany: jest.fn().mockResolvedValue(mockPoems),
        count: jest.fn().mockResolvedValue(2),
        findUnique: jest.fn().mockResolvedValue(mockPoems[0]),
        findFirst: jest.fn().mockResolvedValue(mockPoems[1]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        PoemsService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<PoemsService>(PoemsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return paginated poems", async () => {
      const result = await service.findAll();

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("total");
      expect(result.total).toBe(2);
    });

    it("should filter by dynasty", async () => {
      await service.findAll(1, 20, "唐");

      expect(prismaService.poem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ dynasty: "唐" }),
        }),
      );
    });

    it("should filter by search keyword", async () => {
      await service.findAll(1, 20, undefined, "静夜思");

      expect(prismaService.poem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ title: { contains: "静夜思" } }),
            ]),
          }),
        }),
      );
    });
  });

  describe("findOne", () => {
    it("should return a poem by id", async () => {
      const result = await service.findOne("1");

      expect(result).toBeDefined();
      expect(prismaService.poem.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should return null if poem not found", async () => {
      (prismaService.poem.findUnique as jest.Mock).mockResolvedValueOnce(null);
      const result = await service.findOne("999");

      expect(result).toBeNull();
    });
  });

  describe("findByTitle", () => {
    it("should return a poem by title", async () => {
      const result = await service.findByTitle("静夜思");

      expect(result).toBeDefined();
      expect(prismaService.poem.findFirst).toHaveBeenCalledWith({
        where: { title: "静夜思" },
      });
    });
  });

  describe("findRandom", () => {
    it("should return a random poem", async () => {
      const result = await service.findRandom();

      expect(result).toBeDefined();
    });

    it("should return null if no poems exist", async () => {
      (prismaService.poem.count as jest.Mock).mockResolvedValueOnce(0);
      const result = await service.findRandom();

      expect(result).toBeNull();
    });
  });

  describe("findNeighbors", () => {
    it("should return neighbors for a poem", async () => {
      const result = await service.findNeighbors("1");

      expect(result).toHaveProperty("prev");
      expect(result).toHaveProperty("next");
    });

    it("should return null neighbors if poem not found", async () => {
      (prismaService.poem.findUnique as jest.Mock).mockResolvedValueOnce(null);
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
