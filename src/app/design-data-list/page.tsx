import React from "react"
import DesignDataListPage from "./components/DesignDataListPage"
import { Metadata } from "next"

export default function Page() {
  return <DesignDataListPage />
}

export const metadata: Metadata = {
  title: "设计数据列表-平台端",
}
