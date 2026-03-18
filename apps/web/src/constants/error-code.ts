/**
 * 错误码映射 - 与后端保持一致
 * 格式: 模块(2位) + 错误类型(2位) + 序号(2位)
 */

// 错误码枚举
export const ErrorCode = {
  SUCCESS: '000000',
  BAD_REQUEST: '000001',
  UNAUTHORIZED: '000002',
  FORBIDDEN: '000003',
  NOT_FOUND: '000004',
  INTERNAL_SERVER_ERROR: '000005',
  SERVICE_UNAVAILABLE: '000006',

  // 汉字模块
  CHARACTER_NOT_FOUND: '010001',
  CHARACTER_INVALID_ID: '010002',

  // 成语模块
  IDIOM_NOT_FOUND: '020001',
  IDIOM_INVALID_ID: '020002',

  // 古诗模块
  POEM_NOT_FOUND: '030001',
  POEM_INVALID_ID: '030002',

  // 参数校验
  INVALID_PAGE: '040001',
  INVALID_LIMIT: '040002',
  INVALID_DYNASTY: '040003',
  INVALID_SEARCH_KEYWORD: '040004',

  // 数据库
  DATABASE_ERROR: '050001',
  DATABASE_CONNECTION_FAILED: '050002',
} as const

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode]

// 错误码到用户友好消息的映射
export const ErrorCodeMessages: Record<string, string> = {
  // 通用
  '000000': '操作成功',
  '000001': '请求参数错误',
  '000002': '未授权，请重新登录',
  '000003': '没有权限访问该资源',
  '000004': '请求的资源不存在',
  '000005': '服务器内部错误',
  '000006': '服务暂时不可用',

  // 汉字
  '010001': '汉字不存在',
  '010002': '无效的汉字ID',

  // 成语
  '020001': '成语不存在',
  '020002': '无效的成语ID',

  // 古诗
  '030001': '古诗不存在',
  '030002': '无效的古诗ID',

  // 参数校验
  '040001': '页码参数无效',
  '040002': '每页数量参数无效',
  '040003': '朝代参数无效',
  '040004': '搜索关键词无效',

  // 数据库
  '050001': '数据操作失败，请稍后重试',
  '050002': '数据库连接失败',
}

/**
 * 根据错误码获取用户友好的错误消息
 */
export function getErrorMessage(code: string): string {
  return ErrorCodeMessages[code] || '未知错误，请稍后重试'
}
