"use client"
import React from "react"
import SideBar from "../components/SideBar"
import Main from "../components/Main"
import useSWRMutation from "swr/mutation"
import useSWR from "swr"
import { reqGetEBSList } from "../api"
import DesignDataContext from "../context/useDesignData"
import { EBSTreeData } from "../types"
import { useSearchParams } from "next/navigation"
import { Breadcrumbs } from "@mui/material"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"

export default function DesignDataPage() {
  const searchParams = useSearchParams()
  const { data, isLoading, mutate } = useSWR(
    "/ebs",
    (url) =>
      reqGetEBSList(url, {
        arg: searchParams.get("code")
          ? { level: 2, code: searchParams.get("code") as string }
          : { level: 1 },
      }),
    {
      onSuccess(data) {
        if (ebsId <= 0) {
          setEbsId(data[0].id)
          setTreeItem(data[0])
        }
      },
    },
  )
  const { trigger: getEBSListApi } = useSWRMutation("/ebs", reqGetEBSList)

  const [ebsId, setEbsId] = React.useState(0)
  const [treeItem, setTreeItem] = React.useState<EBSTreeData>({} as EBSTreeData)

  // 获取子集节点
  const getSubEBSList = async (value: string, allIndex?: number[], isFlag?: boolean) => {
    const newData = structuredClone(data)

    if (isFlag) {
      const treeItem = eval("newData[" + allIndex?.join("].children[") + "]")
      treeItem.has_structure = "yes"

      mutate(newData as any, false)
      return
    }

    const treeItem = eval("newData[" + allIndex?.join("].children[") + "]")
    setTreeItem(treeItem)
    // eslint-disable-next-line no-unused-vars
    const res = await getEBSListApi({ code: value, level: treeItem.level + 1 })
    // 深拷贝对象

    // 格式为 'newData[0].children[0].children'
    const str = "newData[" + allIndex?.join("].children[") + "].children"
    eval(str + "=res")
    mutate(newData as any, false)
  }

  // 切换选中的EBS id

  const handleChangeEBSId = (id: number | string) => {
    setEbsId(+id)
  }

  const [treeStr, setTreeStr] = React.useState("")

  const changeTreeStr = (str: string) => {
    setTreeStr(str)
  }

  if (isLoading) {
    return <></>
  }

  return (
    <DesignDataContext.Provider
      value={{
        firstTreeList: data as EBSTreeData[],
        changeFirstTreeList: () => {},
        ebs_id: ebsId as number,
        changeEBSId: handleChangeEBSId,
        treeItem,
        treeStr,
        changeTreeStr,
      }}>
      <h3 className="font-bold text-[1.875rem]">设计数据模板</h3>
      <Breadcrumbs aria-label="breadcrumb" className="my-2">
        <Link underline="hover" color="inherit" href="/">
          首页
        </Link>
        <Link underline="hover" color="inherit" href="/design-data-list">
          设计数据列表
        </Link>
        <Typography color="text.primary">设计数据模板</Typography>
      </Breadcrumbs>
      <div className="flex-1 flex-shrink-0 overflow-auto bg-white">
        <div className="flex w-full h-full page_main design_data">
          <aside className="w-96 border min-w-[24rem] h-full">
            <SideBar getSubEBSList={getSubEBSList} />
          </aside>
          <main className="flex-1 flex-shrink-0 ml-3 border min-w-[62.5rem] overflow-auto">
            <Main getSubEBSList={getSubEBSList} />
          </main>
        </div>
      </div>
    </DesignDataContext.Provider>
  )
}
