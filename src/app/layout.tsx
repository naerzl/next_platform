"use client"
import { Inter } from "next/font/google"
import Side from "@/components/Side"
import React from "react"
import Nav from "@/components/Nav"
// import { Breadcrumbs } from "@mui/material"
// import Link from "@mui/material/Link"
// import Typography from "@mui/material/Typography"
import { SWRConfig } from "swr"
// import { usePathname } from "next/navigation"
import StyledComponentsRegistry from "@/libs/AntdRegistry"
import "./globals.scss"
import LayoutContext from "@/app/context/LayoutContext"
// import { useScroll } from "ahooks"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" id="_next">
      <body className={`${inter.className} flex`}>
        <StyledComponentsRegistry>
          <SWRConfig value={{ provider: () => new Map() }}>
            <aside className={`h-full min-w-[15rem] w-60 border-r`}>
              <Side />
            </aside>
            <div className="flex-1 flex  flex-col bg-[#f8fafb] min-w-[50.625rem] overflow-auto">
              <Nav />
              <main className="px-7.5 py-12  flex flex-col ">{children}</main>
            </div>
          </SWRConfig>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}

export const dynamic = "force-dynamic"
