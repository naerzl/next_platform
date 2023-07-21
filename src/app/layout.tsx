"use client"
import "./globals.scss"
import { Inter } from "next/font/google"
import Side from "@/components/Side"
import React from "react"
import Nav from "@/components/Nav"
import { Breadcrumbs } from "@mui/material"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import { SWRConfig } from "swr"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "中铁六局",
  description: "Generated by create next app",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" id="_next">
      <body className={`${inter.className} flex`}>
        <SWRConfig value={{ provider: () => new Map() }}>
          <aside className="h-full w-60  min-w-[15rem]">
            <Side />
          </aside>
          <div className="flex-1 flex  flex-col bg-[#f8fafb] min-w-[50.625rem] overflow-overlay">
            <Nav />
            <main className="p-7 flex-1 max-main flex flex-col">
              <h3 className="font-bold text-[1.875rem]">标题</h3>
              <Breadcrumbs aria-label="breadcrumb" className="my-2">
                <Link underline="hover" color="inherit" href="/">
                  MUI
                </Link>
                <Link
                  underline="hover"
                  color="inherit"
                  href="/material-ui/getting-started/installation/">
                  Core
                </Link>
                <Typography color="text.primary">Breadcrumbs</Typography>
              </Breadcrumbs>
              {children}
            </main>
          </div>
        </SWRConfig>
      </body>
    </html>
  )
}
