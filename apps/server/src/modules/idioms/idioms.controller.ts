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
import { IdiomsService } from "./idioms.service";
import { IdiomQueryDto } from "../../dtos/idiom-query.dto";
import { CacheInterceptor } from "@nestjs/cache-manager";

@ApiTags("idioms")
@Controller("idioms")
@UseInterceptors(CacheInterceptor)
export class IdiomsController {
  constructor(private readonly idiomsService: IdiomsService) {}

  @Get()
  @ApiOperation({
    summary: "获取成语列表",
    description: "分页获取成语列表，支持按关键词搜索",
  })
  @ApiQuery({ name: "page", description: "页码，默认1", required: false })
  @ApiQuery({
    name: "limit",
    description: "每页数量，默认20，最大100",
    required: false,
  })
  @ApiQuery({ name: "search", description: "搜索关键词", required: false })
  @ApiResponse({
    status: 200,
    description: "返回分页的成语列表",
  })
  findAll(@Query() query: IdiomQueryDto) {
    return this.idiomsService.findAll(query.page, query.limit, query.search);
  }

  @Get("count")
  @ApiOperation({
    summary: "获取成语总数",
    description: "获取数据库中成语的总数量",
  })
  @ApiResponse({ status: 200, description: "成语总数" })
  count() {
    return this.idiomsService.count();
  }

  @Get("random")
  @ApiOperation({
    summary: "随机获取一个成语",
    description: "随机返回一个成语的详细信息",
  })
  @ApiResponse({ status: 200, description: "随机成语详情" })
  random() {
    return this.idiomsService.findRandom();
  }

  @Get("search")
  @ApiOperation({
    summary: "搜索成语",
    description: "根据关键词搜索成语，返回最多20条结果",
  })
  @ApiQuery({ name: "q", description: "搜索关键词", required: true })
  @ApiResponse({ status: 200, description: "搜索结果" })
  search(@Query("q") q: string) {
    return this.idiomsService.findAll(1, 20, q);
  }

  @Get(":id")
  @ApiOperation({
    summary: "获取单个成语详情",
    description: "根据ID获取成语的详细信息",
  })
  @ApiParam({ name: "id", description: "成语ID (UUID)", type: String })
  @ApiResponse({ status: 200, description: "成语详情" })
  @ApiResponse({ status: 404, description: "未找到该成语" })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.idiomsService.findOne(id);
  }

  @Get(":id/neighbors")
  @ApiOperation({
    summary: "获取相邻成语",
    description: "获取指定成语的上一个和下一个成语（按ID排序）",
  })
  @ApiParam({ name: "id", description: "成语ID", type: String })
  @ApiResponse({ status: 200, description: "相邻成语信息" })
  neighbors(@Param("id", ParseUUIDPipe) id: string) {
    return this.idiomsService.findNeighbors(id);
  }
}
