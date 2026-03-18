import { Test, TestingModule } from "@nestjs/testing";
import { CharactersService } from "./characters.service";
import { PrismaService } from "../../prisma/prisma.service";
import { LoggerModule } from "../../logger/logger.module";

describe("CharactersService", () => {
  let service: CharactersService;
  let prismaService: Partial<PrismaService>;

  const mockCharacters = [
    {
      id: "1",
      word: "一",
      pinyin: "yī",
      explanation: "数字一",
      strokes: 1,
      difficulty: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      word: "二",
      pinyin: "èr",
      explanation: "数字二",
      strokes: 2,
      difficulty: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      word: "三",
      pinyin: "sān",
      explanation: "数字三",
      strokes: 3,
      difficulty: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    prismaService = {
      character: {
        findMany: jest.fn().mockResolvedValue(mockCharacters),
        count: jest.fn().mockResolvedValue(3),
        findUnique: jest.fn().mockResolvedValue(mockCharacters[0]),
        findFirst: jest.fn().mockResolvedValue(mockCharacters[1]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        CharactersService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return paginated characters", async () => {
      const result = await service.findAll(1, 20);

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("page");
      expect(result).toHaveProperty("limit");
      expect(result.total).toBe(3);
    });

    it("should apply pagination correctly", async () => {
      await service.findAll(2, 10);

      expect(prismaService.character.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });

    it("should apply search filter", async () => {
      await service.findAll(1, 20, "一");

      expect(prismaService.character.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ word: { contains: "一" } }),
            ]),
          }),
        }),
      );
    });
  });

  describe("findOne", () => {
    it("should return a character by id", async () => {
      const result = await service.findOne("1");

      expect(result).toBeDefined();
      expect(prismaService.character.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should return null if character not found", async () => {
      (prismaService.character.findUnique as jest.Mock).mockResolvedValueOnce(
        null,
      );
      const result = await service.findOne("999");

      expect(result).toBeNull();
    });
  });

  describe("findByWord", () => {
    it("should return a character by word", async () => {
      const result = await service.findByWord("一");

      expect(result).toBeDefined();
      expect(prismaService.character.findUnique).toHaveBeenCalledWith({
        where: { word: "一" },
      });
    });
  });

  describe("findRandom", () => {
    it("should return a random character", async () => {
      const result = await service.findRandom();

      expect(result).toBeDefined();
      expect(prismaService.character.count).toHaveBeenCalled();
      expect(prismaService.character.findFirst).toHaveBeenCalled();
    });

    it("should return null if no characters exist", async () => {
      (prismaService.character.count as jest.Mock).mockResolvedValueOnce(0);
      const result = await service.findRandom();

      expect(result).toBeNull();
    });
  });

  describe("findNeighbors", () => {
    it("should return neighbors for a character", async () => {
      const result = await service.findNeighbors("1");

      expect(result).toHaveProperty("prev");
      expect(result).toHaveProperty("next");
    });

    it("should return null neighbors if character not found", async () => {
      (prismaService.character.findUnique as jest.Mock).mockResolvedValueOnce(
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

      expect(result).toBe(3);
      expect(prismaService.character.count).toHaveBeenCalled();
    });
  });
});
