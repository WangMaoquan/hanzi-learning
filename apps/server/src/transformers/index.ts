import { Character, Idiom, Poem } from "@prisma/client";
import type { CharacterVO, IdiomVO, PoemVO, PaginatedVO } from "./vo";

// 通用的分页转换 - 使用泛型
function createPaginatedVO<T, P>(
  list: P[],
  total: number,
  page: number,
  limit: number,
  toVOFn: (item: P) => T,
): PaginatedVO<T> {
  return {
    data: list.map(toVOFn),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// 汉字转换
export class CharacterTransformer {
  static toVO = (char: Character): CharacterVO => ({
    id: char.id,
    title: char.word,
    content: char.explanation || "",
    pinyin: char.pinyin,
    pinyins: char.pinyins,
    radicals: char.radical,
    strokes: char.strokes,
    structure: char.structure as CharacterVO["structure"],
    difficulty: 1, // TODO: 后续可以从数据库字段获取
    tags: [], // TODO: 后续可以从数据库字段获取
    words: char.words || [],
    createdAt: char.createdAt.toISOString(),
    updatedAt: char.updatedAt.toISOString(),
  });

  static toVOList = (chars: Character[]): CharacterVO[] => chars.map(this.toVO);

  static toPaginatedVO = (
    chars: Character[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedVO<CharacterVO> =>
    createPaginatedVO(chars, total, page, limit, this.toVO);
}

// 成语转换
export class IdiomTransformer {
  static toVO = (idiom: Idiom): IdiomVO => ({
    id: idiom.id,
    title: idiom.word,
    content: idiom.explanation || "",
    pinyin: idiom.pinyin,
    derivation: idiom.derivation,
    example: idiom.example,
    synonyms: idiom.synonyms || [],
    antonyms: idiom.antonyms || [],
    createdAt: idiom.createdAt.toISOString(),
    updatedAt: idiom.updatedAt.toISOString(),
  });

  static toVOList = (idioms: Idiom[]): IdiomVO[] => idioms.map(this.toVO);

  static toPaginatedVO = (
    idioms: Idiom[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedVO<IdiomVO> =>
    createPaginatedVO(idioms, total, page, limit, this.toVO);
}

// 古诗转换
export class PoemTransformer {
  static toVO = (poem: Poem): PoemVO => ({
    id: poem.id,
    title: poem.title,
    content: poem.content,
    author: poem.author,
    pinyin: poem.pinyin,
    difficulty: poem.difficulty || 1,
    tags: poem.tags || [],
    dynasty: poem.dynasty,
    type: poem.type,
    verses: poem.verses || [],
    versePinyins: poem.versePinyins as PoemVO["versePinyins"],
    createdAt: poem.createdAt.toISOString(),
    updatedAt: poem.updatedAt.toISOString(),
  });

  static toVOList = (poems: Poem[]): PoemVO[] => poems.map(this.toVO);

  static toPaginatedVO = (
    poems: Poem[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedVO<PoemVO> =>
    createPaginatedVO(poems, total, page, limit, this.toVO);
}
