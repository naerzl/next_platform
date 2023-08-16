const auth2_url = process.env.NEXT_PUBLIC_AUTH2_URL
// 获取token
export const reqOauth2GetToken = (search?: string) => {
  // @ts-ignore
  return fetch(`${auth2_url}/oauth2?${search}`).then((res) => res.json())
}

// 刷新token
export const reqOauth2Refresh = () => {
  return fetch(`${auth2_url}/refresh`).then((res) => res.json())
}
