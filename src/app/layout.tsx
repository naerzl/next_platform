"use client"
import { Inter } from "next/font/google"
import Side, { changeMenu, ItemCombination, MenuItemX } from "@/components/Side"
import React, { useEffect, useState } from "react"
import Nav from "@/components/Nav"
import { SWRConfig } from "swr"
import StyledComponentsRegistry from "@/libs/AntdRegistry"
import "./globals.scss"
import { usePathname, useRouter } from "next/navigation"
import { ConfirmProvider } from "material-ui-confirm"
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined"
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined"
import SupervisedUserCircleOutlinedIcon from "@mui/icons-material/SupervisedUserCircleOutlined"
import { trim } from "@/libs/methods"

const inter = Inter({ subsets: ["latin"] })

<<<<<<< HEAD
const menuList: MenuItemX = {
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

=======
>>>>>>> 488a6effd2481699d397f076161ac99025a52b4a
export default function RootLayout({ children }: { children: React.ReactNode }) {
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
<<<<<<< HEAD

  // 处理展开菜单展开
  const pathname = usePathname()
  const pathArr = trim(pathname, "/").split("/")
  // 路由对象
  const router = useRouter()

  // 注册状态
  const [menus, setMenus] = useState(menuList)

  // 菜单点击事件
  const whenMenuClick = (currentItems: ItemCombination, previousItems?: ItemCombination) => {
    let focusItems = changeMenu(menuList, currentItems, previousItems)

    // 处理跳转
    if (currentItems.item.path != null) {
      router.push(currentItems.item.path)
    }

    setMenus({ ...focusItems })

    return true
  }

  useEffect(() => {
    Object.keys(menuList).map((index) => {
      if (typeof menuList[index].children != "undefined" && menuList[index].children![pathArr[0]]) {
        menuList[index].open = true
        menuList[index].children![pathArr[0]].open = true
      }
    })
    setMenus({ ...menuList })
  }, [pathname])
=======
>>>>>>> 488a6effd2481699d397f076161ac99025a52b4a

  return (
    <html lang="en" id="_next">
      <body className={`${inter.className} flex`}>
        <StyledComponentsRegistry>
<<<<<<< HEAD
          <ConfirmProvider>
            <SWRConfig value={{ provider: () => new Map() }}>
              {pathname != "/" ? (
                <>
                  <aside className={`h-full min-w-[15rem] w-60 border-r`}>
                    <Side items={menus} onClick={whenMenuClick} />
                  </aside>
                  <div className="flex-1 flex  flex-col bg-[#f8fafb] min-w-[50.625rem] overflow-auto">
                    <Nav />
                    <main className="px-7.5 py-12  flex flex-col ">{children}</main>
                  </div>
                </>
              ) : (
                <>{children}</>
              )}
            </SWRConfig>
          </ConfirmProvider>
=======
          <SWRConfig value={{ provider: () => new Map() }}>
            <aside className={`h-full min-w-[15rem] w-60 border-r`}>
              <Side />
            </aside>
            <div
              className="flex-1 flex  flex-col bg-[#f8fafb] min-w-[50.625rem] overflow-auto "
              // ref={scroll_dom}
            >
              <Nav />
              <main className="px-7.5 py-12  flex flex-col ">{children}</main>
            </div>
          </SWRConfig>
>>>>>>> 488a6effd2481699d397f076161ac99025a52b4a
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}

export const dynamic = "force-dynamic"
