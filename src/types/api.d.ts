export interface ReqFetch<T> {
  code: number
  msg: string
  data: T
}

export interface FetchParams<T> {
  arg: T
}

// 登录接口响应数据类型
export interface ReqLoginResponse {
  location: string
  is_first_login: boolean
}

// 登录接口请求参数
export interface ReqLoginParams {
  username: string
  password: string
  client_id: string
  redirect_uri: string
  response_type: string
  code_challenge: string
  code_challenge_method: string
  state: string
  scope: string
}

// auth2.0获取token参数
export interface ReqOauth2TokenParams {
  state: string
  code: string
}

// 修改密码接口参数
export interface ReqChangePasswordParams {
  password: string
  checked_password: string
}

export interface ReqLoginPhoneCodeParams {
  phone: string
  code: string
  client_id: string
  redirect_uri: string
  response_type: string
  code_challenge: string
  code_challenge_method: string
  state: string
  scope: string
}
