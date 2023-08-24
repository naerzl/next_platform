import { Metadata } from "next"
import React from "react"
import EBSProfessionPage from "./components/EBSProfessionPage"

export default function page() {
  return <EBSProfessionPage />
}

export const metadata: Metadata = {
  title: "EBS专业",
}
