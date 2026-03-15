import { Controller, Get, Param, Query } from "@nestjs/common";
import { IdiomsService } from "./idioms.service";

@Controller("idioms")
export class IdiomsController {
  constructor(private readonly idiomsService: IdiomsService) {}

  @Get()
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("search") search?: string,
  ) {
    return this.idiomsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      search,
    );
  }

  @Get("count")
  count() {
    return this.idiomsService.count();
  }

  @Get("random")
  random() {
    return this.idiomsService.findRandom();
  }

  @Get("search")
  search(@Query("q") q: string) {
    return this.idiomsService.findAll(1, 20, q);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.idiomsService.findOne(id);
  }
}
