import { Metadata } from "next"
import React from "react"
import CollectionPage from "./components/CollectionPage"

export default function Collection() {
  return <CollectionPage />
}

export const metadata: Metadata = {
  title: "表结构库",
}
