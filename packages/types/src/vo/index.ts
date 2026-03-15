export type { CharacterVO } from "./character";
export type { IdiomVO } from "./idiom";
export type { PoemVO } from "./poem";

// 通用分页响应
export interface PaginatedVO<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
