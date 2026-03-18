/**
 * 业务错误码枚举
 * 格式: 模块(2位) + 错误类型(2位) + 序号(2位)
 * 例如: 010001 -> 01模块 00类型 01序号
 */
export enum ErrorCode {
  // 通用错误 (00)
  SUCCESS = "000000",
  BAD_REQUEST = "000001",
  UNAUTHORIZED = "000002",
  FORBIDDEN = "000003",
  NOT_FOUND = "000004",
  INTERNAL_SERVER_ERROR = "000005",
  SERVICE_UNAVAILABLE = "000006",

  // 汉字模块 (01)
  CHARACTER_NOT_FOUND = "010001",
  CHARACTER_INVALID_ID = "010002",

  // 成语模块 (02)
  IDIOM_NOT_FOUND = "020001",
  IDIOM_INVALID_ID = "020002",

  // 古诗模块 (03)
  POEM_NOT_FOUND = "030001",
  POEM_INVALID_ID = "030002",

  // 参数校验 (04)
  INVALID_PAGE = "040001",
  INVALID_LIMIT = "040002",
  INVALID_DYNASTY = "040003",
  INVALID_SEARCH_KEYWORD = "040004",

  // 数据库 (05)
  DATABASE_ERROR = "050001",
  DATABASE_CONNECTION_FAILED = "050002",
}

/**
 * 错误码到 HTTP 状态的映射
 */
export const ErrorCodeToStatus: Record<string, number> = {
  // 通用
  "000000": 200, // SUCCESS
  "000001": 400, // BAD_REQUEST
  "000002": 401, // UNAUTHORIZED
  "000003": 403, // FORBIDDEN
  "000004": 404, // NOT_FOUND
  "000005": 500, // INTERNAL_SERVER_ERROR
  "000006": 503, // SERVICE_UNAVAILABLE

  // 模块特定错误
  "010001": 404,
  "010002": 400,
  "020001": 404,
  "020002": 400,
  "030001": 404,
  "030002": 400,

  // 参数校验
  "040001": 400,
  "040002": 400,
  "040003": 400,
  "040004": 400,

  // 数据库
  "050001": 500,
  "050002": 503,
};

/**
 * 错误码到消息的默认映射
 */
export const ErrorCodeMessage: Record<string, string> = {
  // 通用
  "000000": "操作成功",
  "000001": "请求参数错误",
  "000002": "未授权",
  "000003": "禁止访问",
  "000004": "资源不存在",
  "000005": "服务器内部错误",
  "000006": "服务不可用",

  // 汉字
  "010001": "汉字不存在",
  "010002": "无效的汉字ID",

  // 成语
  "020001": "成语不存在",
  "020002": "无效的成语ID",

  // 古诗
  "030001": "古诗不存在",
  "030002": "无效的古诗ID",

  // 参数校验
  "040001": "无效的页码",
  "040002": "无效的每页数量",
  "040003": "无效的朝代",
  "040004": "无效的搜索关键词",

  // 数据库
  "050001": "数据库操作失败",
  "050002": "数据库连接失败",
};
