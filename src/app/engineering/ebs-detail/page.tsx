import React from "react"
import { Metadata } from "next"
import EBSDetailPage from "./components/EBSDetailPage"

export default function page() {
  return <EBSDetailPage />
}

export const metadata: Metadata = {
  title: "EBS数据",
}
