"use client"
import { Inter } from "next/font/google"
import Side from "@/components/Side"
import React from "react"
import Nav from "@/components/Nav"
import { SWRConfig } from "swr"
import StyledComponentsRegistry from "@/libs/AntdRegistry"
import "./globals.scss"
import { usePathname, useRouter, useSelectedLayoutSegment } from "next/navigation"
import { ConfirmProvider } from "material-ui-confirm"
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined"
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined"
import SupervisedUserCircleOutlinedIcon from "@mui/icons-material/SupervisedUserCircleOutlined"
import { generateRandomString } from "@/libs/methods"
import {
  OAUTH2_ACCESS_TOKEN,
  OAUTH2_PATH_FROM,
  OAUTH2_TOKEN_EXPIRY,
  STATUS_SUCCESS,
  MINTE5,
} from "@/libs/const"
import { lrsOAuth2Instance } from "@/libs/init_oauth"
import { getV1BaseURL } from "@/libs/fetch"
import { setCookie } from "@/libs/cookies"
import { StatusCodes } from "http-status-codes"
import dayjs from "dayjs"
import { ConfirmationDialogProvider } from "@/components/ConfirmationDialogProvider"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { getPermissionCurrentUser } from "@/app/api"
import { PermissionData } from "@/types/api"
import { LayoutContext } from "@/components/LayoutContext"

const inter = Inter({ subsets: ["latin"] })

const menuList = {
  commonLibrary: {
    title: "公共库",
    icon: <ArchiveOutlinedIcon />,
    open: false,
    children: {
      dictionary: {
        path: "/dictionary",
        title: "字典库",
        open: false,
      },
      collection: {
        path: "/collection",
        title: "表结构库",
        open: false,
      },
    },
  },
  dataTemplate: {
    title: "数据模板",
    icon: <TuneOutlinedIcon />,
    open: false,
    children: {
      "ebs-profession": {
        path: "/ebs-profession",
        title: "EBS专业列表",
        open: false,
      },
      engineering: {
        path: "/engineering",
        title: "工程专业列表",
        open: false,
      },
      "design-data-list": {
        path: "/design-data-list",
        title: "设计数据列表",
        open: false,
      },
    },
  },
  userManagement: {
    title: "用户管理",
    icon: <SupervisedUserCircleOutlinedIcon />,
    open: false,
    children: {
      "member-department": {
        path: "/member-department",
        title: "成员部门",
        open: false,
      },
    },
  },
}

export default function RootLayout({ children }: { children: any }) {
  // const scroll_dom = React.useRef<HTMLDivElement>(null)
  //
  // const [scroll, setScroll] = useState(0)
  //
  // useEffect(() => {
  //   const handleScroll = () => {
  //     setScroll(scroll_dom.current!.scrollTop)
  //   }
  //   scroll_dom.current?.addEventListener("scroll", handleScroll, { passive: true })
  //
  //   return () => scroll_dom.current?.removeEventListener("scroll", handleScroll)
  // }, [scroll])

  const segment = useSelectedLayoutSegment()

  // 处理展开菜单展开
  const pathname = usePathname()

  const router = useRouter()

  const handleGoToLogin = async () => {
    const state = generateRandomString()
    // 补货到抛出的错误 重新初始化token 重新登录
    const res = await lrsOAuth2Instance.lrsOAuth2Initiate(getV1BaseURL("/initiate"), {
      state,
      redirect_url: location.origin + "/auth2",
    })
    if (res.code === STATUS_SUCCESS) {
      // 存储当前的url地址
      setCookie(OAUTH2_PATH_FROM as string, location.origin + "/dashboard")
      // 跳转到登录页面的地址
      location.href = res.data.location
    }
  }

  const [waitToken, setWaitToken] = React.useState(false)

  const refreshToken = async (token: string) => {
    try {
      setWaitToken(true)
      const resRefresh = await lrsOAuth2Instance.lrsOAuth2rRefreshToken(
        getV1BaseURL("/refresh"),
        `Bearer ${token}`,
      )
      if (resRefresh.status == StatusCodes.UNAUTHORIZED) {
        throw new Error("401")
      }
      const result = await resRefresh.json()
      if (result.code == STATUS_SUCCESS) {
        // 设置新的cookie
        // setCookie(OAUTH2_ACCESS_TOKEN, result.data.access_token)
        localStorage.setItem(OAUTH2_ACCESS_TOKEN, result.data.access_token)
      }
    } finally {
      setWaitToken(false)
    }
  }

  const [accessToken, setAccessToken] = React.useState<string | null>(null)

  React.useEffect(() => {
    let token = localStorage.getItem(OAUTH2_ACCESS_TOKEN)

    setAccessToken(token)

    if (pathname != "/" && pathname != "/auth2/") {
      if (!token) {
        handleGoToLogin()
      } else {
        const time = localStorage.getItem(OAUTH2_TOKEN_EXPIRY)
        if (dayjs(time).unix() * 1000 - Date.now() < MINTE5) {
          refreshToken(token)
        }
      }
    }
  }, [pathname])

  const [waitWithProjectAndPermission, setWaitWithProjectAndPermission] = React.useState(false)

  const [permission, setPermission] = React.useState<PermissionData[]>([])

  const [permissionTagList, setPermissionTagList] = React.useState<string[]>([])

  const getProjectList = async () => {
    try {
      setWaitWithProjectAndPermission(true)
      const res = await getPermissionCurrentUser("/permission/current/user")
      if (!res || res.length <= 0) {
        localStorage.removeItem(OAUTH2_ACCESS_TOKEN)
        router.push(process.env.NEXT_PUBLIC_WEB_PATH!)
        return
      }
      setPermission(res)
      let obj: any = {}
      setPermissionTagList(
        res.map((item) => {
          const tag = item.permission + "_" + item.action
          const str = tag.trim()
          obj[str] = str
          return str
        }),
      )

      console.log(JSON.stringify(obj))
    } finally {
      setWaitWithProjectAndPermission(false)
    }
  }

  React.useEffect(() => {
    if (!pathname.startsWith("/auth2") && pathname != "/") {
      getProjectList()
    }
  }, [pathname])

  if (
    (!accessToken && segment && segment != "auth2") ||
    waitToken ||
    waitWithProjectAndPermission
  ) {
    return (
      <html lang="en" id="_next">
        <body className={`${inter.className} flex`}>
          <div className="container">
            <div className="loader"></div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <html lang="en" id="_next">
      <body className={`${inter.className} flex`}>
        <LayoutContext.Provider value={{ permissionTagList, permissionList: permission }}>
          <StyledComponentsRegistry>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ConfirmProvider>
                <ConfirmationDialogProvider>
                  <SWRConfig value={{ provider: () => new Map() }}>
                    {pathname != "/" ? (
                      <>
                        <aside className={`h-full min-w-[15rem] w-60 border-r`}>
                          <Side />
                        </aside>
                        <div className="flex-1 flex  flex-col bg-[#f8fafb] min-w-[50.625rem] overflow-auto">
                          <Nav />
                          <main
                            className="px-7.5 py-12  flex flex-col "
                            style={{ height: "calc(100vh - 64px)" }}>
                            {children}
                          </main>
                        </div>
                      </>
                    ) : (
                      <>{children}</>
                    )}
                  </SWRConfig>
                </ConfirmationDialogProvider>
              </ConfirmProvider>
            </LocalizationProvider>
          </StyledComponentsRegistry>
        </LayoutContext.Provider>
      </body>
    </html>
  )
}

export const dynamic = "force-dynamic"
