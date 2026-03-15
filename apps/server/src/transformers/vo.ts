// 汉字 VO - 转换为前端需要的格式
export interface CharacterVO {
  id: string;
  title: string; // word -> title
  content: string; // explanation -> content
  pinyin: string | null;
  pinyins: string | null;
  radicals: string | null; // radical -> radicals
  strokes: number | null;
  structure: "左右" | "上下" | "包围" | "独体" | "品字" | null;
  difficulty: number;
  tags: string[];
  words: string[];
  createdAt: string;
  updatedAt: string;
}

// 成语 VO
export interface IdiomVO {
  id: string;
  title: string; // word -> title
  content: string; // explanation -> content
  pinyin: string | null;
  derivation: string | null;
  example: string | null;
  synonyms: string[];
  antonyms: string[];
  createdAt: string;
  updatedAt: string;
}

// 古诗 VO
export interface PoemVO {
  id: string;
  title: string;
  author: string;
  content: string;
  pinyin: string | null;
  difficulty: number;
  tags: string[];
  dynasty: string;
  type: string | null;
  verses: string[];
  versePinyins: string[][] | null;
  createdAt: string;
  updatedAt: string;
}

// 列表响应 VO
export interface PaginatedVO<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
