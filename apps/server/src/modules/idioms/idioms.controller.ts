import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { IdiomsService } from "./idioms.service";
import { IdiomQueryDto } from "../../dtos/idiom-query.dto";
import { CacheInterceptor } from "@nestjs/cache-manager";

@ApiTags("idioms")
@Controller("idioms")
@UseInterceptors(CacheInterceptor)
export class IdiomsController {
  constructor(private readonly idiomsService: IdiomsService) {}

  @Get()
  @ApiOperation({ summary: "获取成语列表" })
  findAll(@Query() query: IdiomQueryDto) {
    return this.idiomsService.findAll(query.page, query.limit, query.search);
  }

  @Get("count")
  @ApiOperation({ summary: "获取成语总数" })
  count() {
    return this.idiomsService.count();
  }

  @Get("random")
  @ApiOperation({ summary: "随机获取一个成语" })
  random() {
    return this.idiomsService.findRandom();
  }

  @Get("search")
  @ApiOperation({ summary: "搜索成语" })
  @ApiQuery({ name: "q", description: "搜索关键词", required: true })
  search(@Query("q") q: string) {
    return this.idiomsService.findAll(1, 20, q);
  }

  @Get(":id")
  @ApiOperation({ summary: "获取单个成语详情" })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.idiomsService.findOne(id);
  }

  @Get(":id/neighbors")
  @ApiOperation({ summary: "获取上一个和下一个成语" })
  neighbors(@Param("id", ParseUUIDPipe) id: string) {
    return this.idiomsService.findNeighbors(id);
  }
}
