import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { CharactersService } from "./characters.service";
import { CharacterQueryDto } from "../../dtos/character-query.dto";
import { CacheInterceptor } from "@nestjs/cache-manager";

@ApiTags("characters")
@Controller("characters")
@UseInterceptors(CacheInterceptor)
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  @ApiOperation({ summary: "获取汉字列表" })
  findAll(@Query() query: CharacterQueryDto) {
    return this.charactersService.findAll(
      query.page,
      query.limit,
      query.search,
    );
  }

  @Get("count")
  @ApiOperation({ summary: "获取汉字总数" })
  count() {
    return this.charactersService.count();
  }

  @Get("random")
  @ApiOperation({ summary: "随机获取一个汉字" })
  random() {
    return this.charactersService.findRandom();
  }

  @Get(":id/neighbors")
  @ApiOperation({ summary: "获取相邻汉字（上一个和下一个）" })
  neighbors(@Param("id", ParseUUIDPipe) id: string) {
    return this.charactersService.findNeighbors(id);
  }

  @Get("search")
  @ApiOperation({ summary: "搜索汉字" })
  @ApiQuery({ name: "q", description: "搜索关键词", required: true })
  search(@Query("q") q: string) {
    return this.charactersService.findAll(1, 20, q);
  }

  @Get(":id")
  @ApiOperation({ summary: "获取单个汉字详情" })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.charactersService.findOne(id);
  }
}
