"use client"
import { Inter } from "next/font/google"
import Side from "@/components/Side"
import React from "react"
import Nav from "@/components/Nav"
import { Breadcrumbs } from "@mui/material"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import { SWRConfig } from "swr"
import { usePathname } from "next/navigation"
import StyledComponentsRegistry from "@/libs/AntdRegistry"
import "./globals.scss"
import LayoutContext from "@/app/context/LayoutContext"
import { useScroll } from "ahooks"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false)

  const changeCollapsed = (bool: boolean) => {
    setCollapsed(bool)
  }

  // function localStorageProvider(): any {
  //   // 初始化时，我们将数据从 `localStorage` 恢复到一个 map 中。
  //   const map = new Map(JSON.parse(localStorage.getItem("app-cache") || "[]"))
  //   // 在卸载 app 之前，我们将所有数据写回 `localStorage` 中。
  //   window.addEventListener("beforeunload", () => {
  //     const appCache = JSON.stringify(Array.from(map.entries()))
  //     localStorage.setItem("app-cache", appCache)
  //   })
  //
  //   // 我们仍然使用 map 进行读写以提高性能。
  //   return map
  // }

  const scroll_dom = React.useRef<HTMLDivElement>(null)

  // const scroll = useScroll(scroll_dom)

  return (
    <html lang="en" id="_next">
      <body className={`${inter.className} flex`}>
        <StyledComponentsRegistry>
          <SWRConfig value={{ provider: () => new Map() }}>
            <aside className={`h-full   ${collapsed ? "" : "min-w-[15rem] w-60"} border-r`}>
              <Side />
            </aside>
            <div
              ref={scroll_dom}
              className="flex-1 flex  flex-col bg-[#f8fafb] min-w-[50.625rem] overflow-auto">
              <Nav collapsed={collapsed} changeCollapsed={changeCollapsed} />
              {/*<LayoutContext.Provider value={{ scroll }}>*/}
              <main className="px-7.5 py-12  flex flex-col">{children}</main>
              {/*</LayoutContext.Provider>*/}
            </div>
          </SWRConfig>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
