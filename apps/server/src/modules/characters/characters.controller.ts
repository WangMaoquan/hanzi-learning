import { Controller, Get, Param, Query } from "@nestjs/common";
import { CharactersService } from "./characters.service";

@Controller("characters")
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("search") search?: string,
  ) {
    return this.charactersService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      search,
    );
  }

  @Get("count")
  count() {
    return this.charactersService.count();
  }

  @Get("random")
  random() {
    return this.charactersService.findRandom();
  }

  @Get("search")
  search(@Query("q") q: string) {
    return this.charactersService.findAll(1, 20, q);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.charactersService.findOne(id);
  }
}
