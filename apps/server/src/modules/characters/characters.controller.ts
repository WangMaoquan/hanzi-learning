import { Controller, Get, Param, Query } from "@nestjs/common";
import { CharactersService } from "./characters.service";

@Controller("characters")
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  findAll(@Query("page") page?: string, @Query("limit") limit?: string) {
    return this.charactersService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.charactersService.findOne(id);
  }
}
