// 初始化oauth1.0的数据个事
export interface LrsOathRequestData_Data {
  oauth_callback?: string
  oauth_verifier?: string
  oauth_token?: string
}

// oauth1.0加密合适
export interface LrsOaurhRequestData {
  url: string
  method: string
  data?: LrsOathRequestData_Data
}
