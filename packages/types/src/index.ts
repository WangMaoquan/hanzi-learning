// 内容类型定义
export type ContentType = "character" | "poem" | "prose" | "idiom";

// 难度等级
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

// 基础内容接口
export interface BaseContent {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  pinyin?: string;
  translation?: string;
  difficulty: DifficultyLevel;
  tags: string[];
  audioUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 汉字特定内容
export interface CharacterContent extends BaseContent {
  type: "character";
  strokes: number;
  radicals: string;
  structure: "左右" | "上下" | "包围" | "独体" | "品字";
  components?: string[];
  words?: string[];
  sentences?: string[];
  pinyins?: string;
}

// ==================== VO 类型（前后端共用） ====================

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

// 通用分页 VO
export interface PaginatedVO<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 古诗特定内容
export interface PoemContent extends BaseContent {
  type: "poem";
  author: string;
  dynasty: "tang" | "song" | "yuan" | "ming" | "qing" | "han" | "wei" | "jin";
  verses: string[];
  versePinyins?: string[][]; // 每句诗每个字的拼音
  annotation?: Record<string, string>;
  appreciation?: string;
  background?: string;
}

// 文言文特定内容
export interface ProseContent extends BaseContent {
  type: "prose";
  author: string;
  dynasty: string;
  source?: string;
  paragraphs: string[];
  annotation?: Record<string, string>;
  paraphrase?: string;
}

// 成语特定内容
export interface IdiomContent extends BaseContent {
  type: "idiom";
  derivation: string;
  examples: string[];
  synonyms?: string[];
  antonyms?: string[];
}

// 联合类型
export type Content =
  | CharacterContent
  | PoemContent
  | ProseContent
  | IdiomContent;

// 学习单元
export interface LearningUnit {
  id: string;
  title: string;
  description: string;
  contents: string[];
  order: number;
  estimatedTime: number;
}

// 学习进度
export interface LearningProgress {
  contentId: string;
  status: "not_started" | "in_progress" | "completed";
  score?: number;
  completedAt?: string;
  lastAccessedAt: string;
}

// 用户学习记录
export interface UserLearning {
  userId: string;
  progress: Record<string, LearningProgress>;
  totalLearned: number;
  streakDays: number;
  lastLearningDate?: string;
}
