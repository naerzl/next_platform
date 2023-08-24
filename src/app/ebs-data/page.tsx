import React from "react"
import EBSDataPage from "@/app/ebs-data/components/EBSDataPage"
import { Metadata } from "next"

export default function Page() {
  return <EBSDataPage />
}

export const metadata: Metadata = {
  title: "EBS数据",
}
