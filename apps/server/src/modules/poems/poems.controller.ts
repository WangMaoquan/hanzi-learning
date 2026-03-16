import { Controller, Get, Param, Query, ParseUUIDPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { PoemsService } from "./poems.service";
import { PoemQueryDto } from "../../dtos/poem-query.dto";

@ApiTags("poems")
@Controller("poems")
export class PoemsController {
  constructor(private readonly poemsService: PoemsService) {}

  @Get()
  @ApiOperation({ summary: "获取古诗列表" })
  findAll(@Query() query: PoemQueryDto) {
    return this.poemsService.findAll(
      query.page,
      query.limit,
      query.dynasty,
      query.search,
    );
  }

  @Get("count")
  @ApiOperation({ summary: "获取古诗总数" })
  count() {
    return this.poemsService.count();
  }

  @Get("random")
  @ApiOperation({ summary: "随机获取一首古诗" })
  random() {
    return this.poemsService.findRandom();
  }

  @Get(":id")
  @ApiOperation({ summary: "获取单首古诗详情" })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.poemsService.findOne(id);
  }

  @Get(":id/neighbors")
  @ApiOperation({ summary: "获取上一首和下一首古诗" })
  neighbors(@Param("id", ParseUUIDPipe) id: string) {
    return this.poemsService.findNeighbors(id);
  }
}
