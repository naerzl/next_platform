import React from "react"
import LockTwoToneIcon from "@mui/icons-material/LockTwoTone"
import DesignDataContext from "../context/useDesignData"

function MainHeader() {
  const ctx = React.useContext(DesignDataContext)
  return (
    <header className="h-28 flex items-center justify-between px-4">
      <div className=" gap-y-4 flex flex-col">
        <div className="h-9">
          <div className="flex items-center h-full">
            <span>节点名称：</span>
            <div className="border flex-1 h-9 leading-[2.25rem] pl-2 text-ellipsis whitespace-nowrap w-6">
              {ctx.treeItem.name}
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center">
            <span>节点编号：</span>
            <div className="border w-80 flex-1 h-9 leading-[2.25rem] pl-2">{ctx.treeItem.code}</div>
          </div>
        </div>
      </div>
      <div>
        <LockTwoToneIcon sx={{ fontSize: "4rem" }} />
      </div>
    </header>
  )
}

export default MainHeader
