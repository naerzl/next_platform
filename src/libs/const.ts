// 大小写数字 字符串 包含两种正则
export const REGEXP_PASSWORD =
  /^(?![\d]+$)(?![a-z]+$)(?![A-Z]+$)(?![!#$%^&*]+$)[\da-zA-z!#$%^&@+_*]{6,8}$/

// 手机号正则
export const REGEXP_PHONE = /^1[3456789]\d{9}$/

// 邮箱正则
export const REGEXP_MAIL = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

// 成功状态码
export const STATUS_SUCCESS = 2000

// oauth2的token
export const OAUTH2_ACCESS_TOKEN = "oauth2_access_token"

export const OAUTH2_PATH_FROM = "oauth2_path_from"

export const OAUTH2_TOKEN_EXPIRY = "oauth2_token_expiry"

export const MINTE5 = 300000

export const ENUM_SUBPARY_CLASS = [
  { label: "专业", value: "field" },
  { label: "分部", value: "subpart" },
  { label: "分项", value: "subitem" },
  { label: "检验批", value: "examination" },
]

export const ENUM_ATTRIBUTION = [
  { label: "平台", value: "platform" },
  { label: "规范", value: "system" },
  { label: "自定义", value: "userdefined" },
  { label: "空", value: "null" },
]
