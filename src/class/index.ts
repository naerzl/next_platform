import { XapiType } from "@/types/authorization"
import {
  LrsOauth2Initiate,
  ReqFetch,
  ReqOauth2GetTokenRequest,
  ReqOauth2GetTokenResponse,
  ReqOauth2InitiateResponse,
} from "./index.d"
import { getCookieAccessToken } from "@/libs/methods"

// 登录基类
interface XapiClassType {
  actor: string
  object: string
  verb: string | XapiType["verb"]
}

// statements类
export class XapiStatementsClass {
  actor: XapiType["actor"]
  verb: XapiType["verb"]
  object: XapiType["object"]
  constructor({ actor, object, verb }: XapiClassType) {
    this.actor = {
      objectType: "Agent",
      openid: actor,
    }
    this.object = {
      objectType: "Activity",
      id: object,
    }
    if (typeof verb === "string") {
      this.verb = {
        id: verb,
      }
    } else {
      this.verb = verb
    }
  }
}

export class LrsOauth2 {
  // OAuth2 初始化
  lrsOAuth2Initiate(
    url: string,
    body: LrsOauth2Initiate,
  ): Promise<ReqFetch<ReqOauth2InitiateResponse>> {
    return fetch(
      // @ts-ignore
      `${url}?${new URLSearchParams(body).toString()}`,
    ).then((res) => res.json())
  }
  //   OAuth2 获取token
  lrsOAuth2GetToken(
    url: string,
    body: ReqOauth2GetTokenRequest,
  ): Promise<ReqFetch<ReqOauth2GetTokenResponse>> {
    return fetch(
      // @ts-ignore
      `${url}?${new URLSearchParams(body).toString()}`,
    ).then((res) => res.json())
  }

  // 刷新token
  lrsOAuth2rRefreshToken(url: string) {
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${getCookieAccessToken()}`,
      },
    })
  }
}
