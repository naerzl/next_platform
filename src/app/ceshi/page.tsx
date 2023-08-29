"use client"

import React from "react"

function Page() {
  return (
    <>
      <p>尝试滚动页面。</p>
      <p>注意: IE/Edge 15 及更早 IE 版本不支持 sticky 属性。</p>

      <div className="">我是粘性定位!</div>

      <div className="h-[2000px]">
        <p className="sticky top-[100px] ">滚动我</p>
        <p>来回滚动我</p>
        <p>滚动我</p>
        <p>来回滚动我</p>
        <p>滚动我</p>
        <p>来回滚动我</p>
      </div>
    </>
  )
}

export default Page
