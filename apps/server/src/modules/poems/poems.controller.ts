import { Controller, Get, Param, Query } from "@nestjs/common";
import { PoemsService } from "./poems.service";

@Controller("poems")
export class PoemsController {
  constructor(private readonly poemsService: PoemsService) {}

  @Get()
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("dynasty") dynasty?: string,
    @Query("search") search?: string,
  ) {
    return this.poemsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      dynasty,
      search,
    );
  }

  @Get("count")
  count() {
    return this.poemsService.count();
  }

  @Get("random")
  random() {
    return this.poemsService.findRandom();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.poemsService.findOne(id);
  }
}
