"use client"
import { Inter } from "next/font/google"
import Side from "@/components/Side"
import React, { useEffect, useRef, useState } from "react"
import Nav from "@/components/Nav"
import { SWRConfig } from "swr"
import StyledComponentsRegistry from "@/libs/AntdRegistry"
import "./globals.scss"
import LayoutContext from "@/app/context/LayoutContext"
// import { useScroll } from "ahooks"

const inter = Inter({ subsets: ["latin"] })

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

  return (
    <html lang="en" id="_next">
      <body className={`${inter.className} flex`}>
        <StyledComponentsRegistry>
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
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}

export const dynamic = "force-dynamic"
