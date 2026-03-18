import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";
import { CharactersService } from "./characters.service";
import { CharacterQueryDto } from "../../dtos/character-query.dto";
import { CacheInterceptor } from "@nestjs/cache-manager";

@ApiTags("characters")
@Controller("characters")
@UseInterceptors(CacheInterceptor)
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  @ApiOperation({
    summary: "获取汉字列表",
    description: "分页获取汉字列表，支持按关键词搜索",
  })
  @ApiQuery({ name: "page", description: "页码，默认1", required: false })
  @ApiQuery({
    name: "limit",
    description: "每页数量，默认20，最大100",
    required: false,
  })
  @ApiQuery({
    name: "search",
    description: "搜索关键词（拼音或释义）",
    required: false,
  })
  @ApiResponse({
    status: 200,
    description:
      "返回分页的汉字列表，包含 data, total, page, limit, totalPages 字段",
  })
  findAll(@Query() query: CharacterQueryDto) {
    return this.charactersService.findAll(
      query.page,
      query.limit,
      query.search,
    );
  }

  @Get("count")
  @ApiOperation({
    summary: "获取汉字总数",
    description: "获取数据库中汉字的总数量",
  })
  @ApiResponse({ status: 200, description: "汉字总数" })
  count() {
    return this.charactersService.count();
  }

  @Get("random")
  @ApiOperation({
    summary: "随机获取一个汉字",
    description: "随机返回一个汉字的详细信息",
  })
  @ApiResponse({ status: 200, description: "随机汉字详情" })
  random() {
    return this.charactersService.findRandom();
  }

  @Get(":id/neighbors")
  @ApiOperation({
    summary: "获取相邻汉字",
    description: "获取指定汉字的上一个和下一个汉字（按ID排序）",
  })
  @ApiParam({ name: "id", description: "汉字ID", type: String })
  @ApiResponse({
    status: 200,
    description: "相邻汉字信息，包含上一个和下一个汉字",
  })
  neighbors(@Param("id", ParseUUIDPipe) id: string) {
    return this.charactersService.findNeighbors(id);
  }

  @Get("search")
  @ApiOperation({
    summary: "搜索汉字",
    description: "根据关键词搜索汉字，返回最多20条结果",
  })
  @ApiQuery({ name: "q", description: "搜索关键词", required: true })
  @ApiResponse({ status: 200, description: "搜索结果" })
  search(@Query("q") q: string) {
    return this.charactersService.findAll(1, 20, q);
  }

  @Get(":id")
  @ApiOperation({
    summary: "获取单个汉字详情",
    description: "根据ID获取汉字的详细信息",
  })
  @ApiParam({ name: "id", description: "汉字ID (UUID)", type: String })
  @ApiResponse({ status: 200, description: "汉字详情" })
  @ApiResponse({ status: 404, description: "未找到该汉字" })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.charactersService.findOne(id);
  }
}
