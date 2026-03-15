import { IsOptional, IsString, IsEnum } from "class-validator";
import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { PaginationQueryDto } from "./pagination.dto";

/**
 * 朝代枚举
 */
export enum DynastyEnum {
  TANG = "tang",
  SONG = "song",
  YUAN = "yuan",
  MING = "ming",
  QING = "qing",
}

/**
 * 古诗查询参数
 */
export class PoemQueryDto extends PartialType(PaginationQueryDto) {
  @ApiPropertyOptional({
    description: "朝代",
    enum: DynastyEnum,
    example: "tang",
  })
  @IsOptional()
  @IsEnum(DynastyEnum)
  dynasty?: DynastyEnum;
}
