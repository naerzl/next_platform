import { Metadata } from "next"
import React from "react"
import EngineeringPage from "./components/EngineeringPage"

export default function Page() {
  return <EngineeringPage />
}

export const metadata: Metadata = {
  title: "工程专业列表-平台端",
}
