import React from "react"
import DictionaryMain from "./components/Main"
import { Metadata } from "next"

export default function DictionaryPage() {
  return <DictionaryMain />
}

export const metadata: Metadata = {
  title: "数据字典",
}
