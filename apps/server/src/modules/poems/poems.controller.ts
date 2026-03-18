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
import { PoemsService } from "./poems.service";
import { PoemQueryDto } from "../../dtos/poem-query.dto";
import { CacheInterceptor } from "@nestjs/cache-manager";

@ApiTags("poems")
@Controller("poems")
@UseInterceptors(CacheInterceptor)
export class PoemsController {
  constructor(private readonly poemsService: PoemsService) {}

  @Get()
  @ApiOperation({
    summary: "获取古诗列表",
    description: "分页获取古诗列表，支持按朝代和关键词筛选",
  })
  @ApiQuery({ name: "page", description: "页码，默认1", required: false })
  @ApiQuery({
    name: "limit",
    description: "每页数量，默认20，最大100",
    required: false,
  })
  @ApiQuery({
    name: "dynasty",
    description: "朝代筛选（如：tang、song、yuan、ming、qing）",
    required: false,
  })
  @ApiQuery({
    name: "search",
    description: "搜索关键词（标题或作者）",
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: "返回分页的古诗列表",
  })
  findAll(@Query() query: PoemQueryDto) {
    return this.poemsService.findAll(
      query.page,
      query.limit,
      query.dynasty,
      query.search,
    );
  }

  @Get("count")
  @ApiOperation({
    summary: "获取古诗总数",
    description: "获取数据库中古诗的总数量",
  })
  @ApiResponse({ status: 200, description: "古诗总数" })
  count() {
    return this.poemsService.count();
  }

  @Get("random")
  @ApiOperation({
    summary: "随机获取一首古诗",
    description: "随机返回一首古诗的详细信息",
  })
  @ApiResponse({ status: 200, description: "随机古诗详情" })
  random() {
    return this.poemsService.findRandom();
  }

  @Get(":id")
  @ApiOperation({
    summary: "获取单首古诗详情",
    description: "根据ID获取古诗的详细信息",
  })
  @ApiParam({ name: "id", description: "古诗ID (UUID)", type: String })
  @ApiResponse({ status: 200, description: "古诗详情" })
  @ApiResponse({ status: 404, description: "未找到该古诗" })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.poemsService.findOne(id);
  }

  @Get(":id/neighbors")
  @ApiOperation({
    summary: "获取相邻古诗",
    description: "获取指定古诗的上一首和下一首古诗（按ID排序）",
  })
  @ApiParam({ name: "id", description: "古诗ID", type: String })
  @ApiResponse({ status: 200, description: "相邻古诗信息" })
  neighbors(@Param("id", ParseUUIDPipe) id: string) {
    return this.poemsService.findNeighbors(id);
  }
}
