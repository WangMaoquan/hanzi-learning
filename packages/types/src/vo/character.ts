// 汉字 VO
export interface CharacterVO {
  id: string;
  title: string;
  content: string;
  pinyin: string | null;
  pinyins: string | null;
  radicals: string | null;
  strokes: number | null;
  structure: "左右" | "上下" | "包围" | "独体" | "品字" | null;
  difficulty: number;
  tags: string[];
  words: string[];
  createdAt: string;
  updatedAt: string;
}
