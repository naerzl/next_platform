export default async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init)
  return res.json()
}

// 拼接接口地址
export const getV1BaseURL = (url: string): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL + url
}
