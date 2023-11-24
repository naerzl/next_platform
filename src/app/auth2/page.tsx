"use client"
import { lrsOAuth2Instance } from "@/libs/init_oauth"
import { getCookie } from "@/libs/cookies"
import { useSearchParams, useRouter } from "next/navigation"
import React from "react"
import { getV1BaseURL } from "@/libs/fetch"
import { OAUTH2_ACCESS_TOKEN, OAUTH2_PATH_FROM, OAUTH2_TOKEN_EXPIRY } from "@/libs/const"

export default function auth2() {
  const searchParams = useSearchParams()
  const router = useRouter()
  React.useEffect(() => {
    lrsOAuth2Instance
      .lrsOAuth2GetToken(getV1BaseURL("/oauth2"), {
        code: searchParams.get("code") as string,
        state: searchParams.get("state") as string,
      })
      .then((res) => {
        if (res.code !== 2000) return
        // setCookie(OAUTH2_ACCESS_TOKEN as string, res.data.access_token)
        localStorage.setItem(OAUTH2_ACCESS_TOKEN as string, res.data.access_token)
        localStorage.setItem(OAUTH2_TOKEN_EXPIRY, res.data.expiry)
        if (searchParams.get("is_first_login") == "true") {
          router.push(
            `${process.env.NEXT_PUBLIC_AUTH_PATH}/firstchangepassword?t=${res.data.access_token}`,
          )
        } else {
          router.push("/dashboard/")
        }
      })
    // @ts-ignore
  }, [])
  return <></>
}
