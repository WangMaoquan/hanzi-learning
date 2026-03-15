import { PartialType } from "@nestjs/swagger";
import { PaginationQueryDto } from "./pagination.dto";

/**
 * 成语查询参数
 */
export class IdiomQueryDto extends PartialType(PaginationQueryDto) {}
