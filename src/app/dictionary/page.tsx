import React from "react"
import DictionaryMain from "./components/Main"
import { Metadata } from "next"

export default function dictionaryPage() {
  return <DictionaryMain />
}

export const metadata: Metadata = {
  title: "数据字典--平台端",
}
