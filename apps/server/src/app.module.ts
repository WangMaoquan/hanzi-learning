import { Module } from "@nestjs/common";
import { CharactersModule } from "./modules/characters/characters.module";
import { IdiomsModule } from "./modules/idioms/idioms.module";
import { PoemsModule } from "./modules/poems/poems.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [PrismaModule, CharactersModule, IdiomsModule, PoemsModule],
})
export class AppModule {}
