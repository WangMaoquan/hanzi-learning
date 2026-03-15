import { Character, Idiom, Poem } from "@prisma/client";
import type { CharacterVO, IdiomVO, PoemVO, PaginatedVO } from "./vo";

// 汉字转换
export class CharacterTransformer {
  static toVO(char: Character): CharacterVO {
    return {
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
    };
  }

  static toVOList(chars: Character[]): CharacterVO[] {
    return chars.map((c) => this.toVO(c));
  }

  static toPaginatedVO(
    chars: Character[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedVO<CharacterVO> {
    return {
      data: this.toVOList(chars),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

// 成语转换
export class IdiomTransformer {
  static toVO(idiom: Idiom): IdiomVO {
    return {
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
    };
  }

  static toVOList(idioms: Idiom[]): IdiomVO[] {
    return idioms.map((i) => this.toVO(i));
  }

  static toPaginatedVO(
    idioms: Idiom[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedVO<IdiomVO> {
    return {
      data: this.toVOList(idioms),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

// 古诗转换
export class PoemTransformer {
  static toVO(poem: Poem): PoemVO {
    return {
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
    };
  }

  static toVOList(poems: Poem[]): PoemVO[] {
    return poems.map((p) => this.toVO(p));
  }

  static toPaginatedVO(
    poems: Poem[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedVO<PoemVO> {
    return {
      data: this.toVOList(poems),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
