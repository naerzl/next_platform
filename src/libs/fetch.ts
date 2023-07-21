import { FetchParams } from "@/types/api"
import { getCookie, setCookie } from "./cookies"
import { formDataInstance, lrsOAuth2Instance } from "./init_oauth"
import { STATUS_SUCCESS } from "./const"
import { StatusCodes } from "http-status-codes"

const OAUTH2_ACCESS_TOKEN = process.env.NEXT_PUBLIC_OAUTH2_ACCESS_TOKEN as string
// 拼接接口地址
export const getV1BaseURL = (url: string): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL + url
}

type MethodsType = "get" | "post" | "put" | "delete" | "patch"

interface FetcherOptions<T> {
  url: string
  method?: MethodsType
  data: FetchParams<T>
}

//
export function fetcher<T>(params: FetcherOptions<T>) {
  let {
    url,
    data: { arg },
    method,
  } = params

  const authCodeOfCookie =
    getCookie(OAUTH2_ACCESS_TOKEN as string) &&
    JSON.parse(getCookie(OAUTH2_ACCESS_TOKEN as string) as string)
  url = getV1BaseURL(url)
  let body = null
  switch (method) {
    case "post":
    case "put":
      body = formDataInstance.convertModelToFormData(arg)
      break
    case "delete":
      url += "/" + arg
      break
    default:
      url += "?" + new URLSearchParams(arg as Record<string, string>).toString()
  }
  return fetch(`${url}`, {
    method: method || "get",
    body: body,
    headers: authCodeOfCookie
      ? {
          Authorization: `Bearer ${authCodeOfCookie.access_token}`,
        }
      : undefined,
  }).then(async (res) => {
    if (res.status == StatusCodes.UNAUTHORIZED) {
      lrsOAuth2Instance
        .lrsOAuth2rRefreshToken(getV1BaseURL("/refresh"), `Bearer ${authCodeOfCookie.access_token}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.code !== 2000) return
          setCookie(process.env.NEXT_PUBLIC_OAUTH2_ACCESS_TOKEN as string, JSON.stringify(res.data))
        })
    }
    let result = await res.json()
    if (result.code !== STATUS_SUCCESS) {
    } else {
      return result
    }
  })
}
