import { Controller, Get, Param, Query } from "@nestjs/common";
import { IdiomsService } from "./idioms.service";

@Controller("idioms")
export class IdiomsController {
  constructor(private readonly idiomsService: IdiomsService) {}

  @Get()
  findAll(@Query("page") page?: string, @Query("limit") limit?: string) {
    return this.idiomsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.idiomsService.findOne(id);
  }
}
