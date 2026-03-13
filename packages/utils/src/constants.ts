// 朝代标签映射
export const DYNASTY_LABELS: Record<string, string> = {
  tang: '唐',
  song: '宋',
  yuan: '元',
  ming: '明',
  qing: '清',
  han: '汉',
  wei: '魏',
  jin: '晋',
}

// 内容类型标签映射
export const CONTENT_TYPE_LABELS: Record<string, string> = {
  character: '汉字',
  poem: '古诗',
  prose: '文言文',
  idiom: '成语',
}

// 难度等级标签映射
export const DIFFICULTY_LABELS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: '入门',
  2: '基础',
  3: '进阶',
  4: '高级',
  5: '专家',
}
