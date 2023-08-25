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

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false)

  const changeCollapsed = (bool: boolean) => {
    setCollapsed(bool)
  }

  return (
    <html lang="en" id="_next">
      <body className={`${inter.className} flex`}>
        <StyledComponentsRegistry>
          <SWRConfig value={{ provider: () => new Map() }}>
            <aside className={`h-full   ${collapsed ? "" : "min-w-[15rem] w-60"}`}>
              <Side />
            </aside>
            <div className="flex-1 flex  flex-col bg-[#f8fafb] min-w-[50.625rem] overflow-overlay">
              <Nav collapsed={collapsed} changeCollapsed={changeCollapsed} />
              <main className="p-7 flex-1 max-main flex flex-col">{children}</main>
            </div>
          </SWRConfig>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
