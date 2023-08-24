import React from "react"
import { Metadata } from "next"
import EBSDetailPage from "./components/EBSDetailPage"

function Page() {
  return <EBSDetailPage />
}

export default Page

export const metadata: Metadata = {
  title: "EBS数据",
}
