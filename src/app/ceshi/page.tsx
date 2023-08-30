"use client"

import React from "react"
import Empty from "@/components/Empty"
import Link from "next/link"

function Page() {
  return (
    <>
      <p>尝试滚动页面。</p>
      <p>注意: IE/Edge 15 及更早 IE 版本不支持 sticky 属性。</p>

      <div className="">我是粘性定位!</div>

      <Empty fontSize="4rem"></Empty>
      <Link href="/ceshi">去测试页面 </Link>
    </>
  )
}

export default Page
