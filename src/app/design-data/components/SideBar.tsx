"use client"
import * as React from "react"
import TreeView from "@mui/lab/TreeView"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import TreeItem from "@mui/lab/TreeItem"
import DesignDataContext from "../context/useDesignData"
import { EBSTreeData } from "../types"

interface Props {
  // eslint-disable-next-line no-unused-vars
  getSubEBSList: (value: string, allIndex?: number[]) => void
}

const ArrToTree = (arr: EBSTreeData[], ctx: any, indexStr = "") => {
  return arr?.map((item, index) => {
    let str = indexStr ? `${indexStr}-${index}` : `${index}`
    return (
      <TreeItem
        className={`text-railway_303 ${item.has_structure == "yes" ? "_ff8a48" : "_fff"}`}
        nodeId={String(`${item.code}-${item.id}-${str}`)}
        label={item.name}
        key={item.id}
        style={{
          color: item.id == ctx.ebs_id ? "#0162b1" : "#000",
        }}>
        {item.children && item.children.length > 0 ? ArrToTree(item.children, ctx, str) : <></>}
      </TreeItem>
    )
  })
}

export default function SideBar(props: Props) {
  const { getSubEBSList } = props
  const ctx = React.useContext(DesignDataContext)

  const handleSelectTree = async (event: React.SyntheticEvent, value: string) => {
    // 拆分选择节点拿到的对应参数
    ctx.changeTreeStr(value)
    console.log(value)

    const strArr = value.split("-")
    ctx.changeEBSId(strArr[1])
    getSubEBSList(value.split("-")[0], strArr.slice(2) as any)
  }

  return (
    <TreeView
      aria-label="file system navigator"
      onNodeSelect={handleSelectTree}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: "100%", flexGrow: 1, maxWidth: 400, overflowY: "auto" }}>
      {ArrToTree(ctx.firstTreeList, ctx, "")}
    </TreeView>
  )
}
