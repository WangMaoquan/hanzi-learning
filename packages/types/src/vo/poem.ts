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
