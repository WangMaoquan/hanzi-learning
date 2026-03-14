import { Module } from "@nestjs/common";
import { IdiomsController } from "./idioms.controller";
import { IdiomsService } from "./idioms.service";

@Module({
  controllers: [IdiomsController],
  providers: [IdiomsService],
})
export class IdiomsModule {}
