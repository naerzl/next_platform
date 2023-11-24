"use client"
import * as React from "react"
import TreeView from "@mui/lab/TreeView"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import TreeItem from "@mui/lab/TreeItem"
import DesignDataContext from "../context/useDesignData"
import { EBSTreeData } from "../types"
import { Modal } from "antd"

interface Props {
  // eslint-disable-next-line no-unused-vars
  getSubEBSList: (value: string, allIndex?: number[]) => void
}

const ArrToTree = (arr: EBSTreeData[], ctx: any, indexStr = "") => {
  return arr?.map((item, index) => {
    let str = indexStr ? `${indexStr}-${index}` : `${index}`

    let count = 0
    if (item.childrenCount) {
      for (const key in item.childrenCount) {
        // @ts-ignore
        count += item.childrenCount[key]
      }
    }

    return (
      <TreeItem
        className={`text-railway_303 ${item.has_structure == "yes" ? "_ff8a48" : "_fff"} ${
          item.id == ctx.ebs_id ? "MUI-tree-item" : ""
        }`}
        nodeId={String(`${item.code}-${item.id}-${str}`)}
        expandIcon={count <= 0 && item.level > 2 ? <></> : <ChevronRightIcon />}
        collapseIcon={count <= 0 && item.level > 2 ? <></> : <ExpandMoreIcon />}
        label={item.name}
        key={item.id}
        style={{
          color: item.id == ctx.ebs_id ? "#0162b1" : "",
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
    if (ctx.isHavaNoSaveData) {
      Modal.confirm({
        content: "当前内容暂未保存，确认切换到其他节点？切换后数据将会丢失",
        onOk() {
          // 修改树形节点的值
          ctx.changeTreeStr(value)
          // 拆分选择节点拿到的对应参数
          const strArr = value.split("-")
          // 修改树形节点的id
          ctx.changeEBSId(strArr[1])
          getSubEBSList(value.split("-")[0], strArr.slice(2) as any)
        },
        icon: <></>,
        okText: "确定",
        cancelText: "取消",
        okButtonProps: { className: "bg-railway_blue" },
      })
      return
    }

    // 修改树形节点的值
    ctx.changeTreeStr(value)
    // 拆分选择节点拿到的对应参数
    const strArr = value.split("-")
    // 修改树形节点的id
    ctx.changeEBSId(strArr[1])
    getSubEBSList(value.split("-")[0], strArr.slice(2) as any)
  }

  return (
    <TreeView
      aria-label="file system navigator"
      onNodeSelect={handleSelectTree}
      sx={{ height: "100%", flexGrow: 1, maxWidth: 400, overflowY: "auto" }}>
      {ArrToTree(ctx.firstTreeList, ctx, "")}
    </TreeView>
  )
}
