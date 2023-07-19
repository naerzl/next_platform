"use client"
import { lrsOAuth2Instance } from "@/libs/init_oauth"
import { getCookie, setCookie } from "@/libs/cookies"
import { useSearchParams, useRouter } from "next/navigation"
import React from "react"
const auth2_url = process.env.NEXT_PUBLIC_AUTH2_URL
const AUTH2PATHFROM = process.env.NEXT_PUBLIC_OAUTH2_PATHNAME_FROM

function Auth2() {
  const searchParams = useSearchParams()
  const router = useRouter()
  React.useEffect(() => {
    lrsOAuth2Instance
      .lrsOAuth2GetToken(`${auth2_url}/oauth2`, {
        code: searchParams.get("code") as string,
        state: searchParams.get("state") as string,
      })
      .then((res) => {
        if (res.code !== 2000) return
        setCookie(process.env.NEXT_PUBLIC_OAUTH2_ACCESS_TOKEN as string, JSON.stringify(res.data))
        if (searchParams.get("is_first_login") == "true") {
          router.push("http://192.168.2.17:3000/firstchangepassword")
        } else {
          router.push(getCookie(AUTH2PATHFROM as string) || "/")
        }
      })
    // @ts-ignore
  }, [])
  return <></>
}

export default Auth2
