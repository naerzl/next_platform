import React from "react"
import DesignDataContext from "../context/useDesignData"

function MainHeader() {
  const ctx = React.useContext(DesignDataContext)
  return (
    <header className="h-28 flex items-center justify-between px-4">
      <div className=" gap-y-4 flex flex-col">
        <div className="h-9">
          <div className="flex items-center h-full">
            <span className="font-bold">节点名称：</span>
            <div className=" flex-1 h-9 leading-[2.25rem] pl-2 text-ellipsis whitespace-nowrap w-6">
              {ctx.treeItem.name}
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center">
            <span className="font-bold">节点编号：</span>
            <div className=" w-80 flex-1 h-9 leading-[2.25rem] pl-2">{ctx.treeItem.code}</div>
          </div>
        </div>
      </div>
      <div></div>
    </header>
  )
}

export default MainHeader
