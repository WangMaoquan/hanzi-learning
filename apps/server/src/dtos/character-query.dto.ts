import { PartialType } from "@nestjs/swagger";
import { PaginationQueryDto } from "./pagination.dto";

/**
 * 汉字查询参数
 */
export class CharacterQueryDto extends PartialType(PaginationQueryDto) {}
