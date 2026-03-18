import { Global, Module } from "@nestjs/common";
import { LoggerModule as NestjsPinoLoggerModule } from "nestjs-pino";
import { PrismaService } from "./prisma.service";

@Global()
@Module({
  imports: [NestjsPinoLoggerModule.forRoot({})],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
