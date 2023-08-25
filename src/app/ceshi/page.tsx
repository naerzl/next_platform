"use client"
import React from "react"
import { generateRandomString } from "@/libs/methods"
import { lrsOAuth2Instance } from "@/libs/init_oauth"
import { OAUTH2_PATH_FROM, STATUS_SUCCESS } from "@/libs/const"
import { setCookie } from "@/libs/cookies"
import { getV1BaseURL } from "@/libs/fetch"

function Page() {
  const getInit = async () => {
    debugger
    const state = generateRandomString()
    // 补货到抛出的错误 重新初始化token 重新登录
    const res = await lrsOAuth2Instance.lrsOAuth2Initiate(getV1BaseURL("/initiate"), {
      state,
      redirect_url: location.origin + "/auth2",
    })
    if (res.code === STATUS_SUCCESS) {
      // 存储当前的url地址
      setCookie(OAUTH2_PATH_FROM as string, location.href)
      // 跳转到登录页面的地址
      location.href = res.data.location
    }
  }

  React.useEffect(() => {
    getInit()
  }, [])
  return <div></div>
}

export default Page
