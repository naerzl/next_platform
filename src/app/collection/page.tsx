import { Metadata } from "next"
import React from "react"
import CollectionPage from "./components/CollectionPage"

export default function collection() {
  return <CollectionPage />
}

export const metadata: Metadata = {
  title: "表结构库--平台端",
}
