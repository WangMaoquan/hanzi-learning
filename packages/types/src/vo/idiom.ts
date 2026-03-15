// 成语 VO
export interface IdiomVO {
  id: string;
  title: string;
  content: string;
  pinyin: string | null;
  derivation: string | null;
  example: string | null;
  synonyms: string[];
  antonyms: string[];
  createdAt: string;
  updatedAt: string;
}
