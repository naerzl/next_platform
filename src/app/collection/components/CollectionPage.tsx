"use client"
import React from "react"
import useSWRMutation from "swr/mutation"
import { reqGetCollection, reqPostAddCollection } from "../api"
import { Button, InputBase } from "@mui/material"
import { message } from "antd"
import CollectionContext from "../context/collectionContext"
import { ReqGetAddCollectionClassResponse } from "../types"
import Table from "./Table"

export default function CollectionPage() {
  // 获取全局上下文
  const ctx = React.useContext(CollectionContext)
  // 头部结构名称添加
  const [inputValue, setInputValue] = React.useState("")
  // 新增表接口名称接口
  const { trigger: postCollectionApi } = useSWRMutation(
    "/structure-collection",
    reqPostAddCollection,
  )
  // 点击保存事件
  const handleClickSave = async () => {
    if (inputValue.trim() !== "" && ctx.currentClassId > 0) {
      await postCollectionApi({ name: inputValue, class_id: ctx.currentClassId })
      message.success("操作成功")
      getCollectionData()
      setInputValue("")
    }
  }
  // 获取表接口名称接口
  const { trigger: getCollectionApi } = useSWRMutation("/structure-collection", reqGetCollection)

  // 表结构名称数据
  const [collectionData, setCollectionData] = React.useState<ReqGetAddCollectionClassResponse[]>([])

  const getCollectionData = React.useCallback(async () => {
    const res = await getCollectionApi({ class_id: ctx.currentClassId })
    setCollectionData(res || [])
  }, [ctx.currentClassId])

  React.useEffect(() => {
    ctx.currentClassId > 0 && getCollectionData()
  }, [ctx.currentClassId])

  return (
    <div className="flex-1 flex flex-col  gap-y-2 min-h-[620px]">
      {/* 头部搜索 */}
      <header className="h-12 flex items-center justify-between px-4">
        <div className="flex items-center h-full w-100">
          <span>表结构名称：</span>
          <div className="border flex-1  h-9 leading-[2.25rem] pl-2 text-ellipsis whitespace-nowrap flex-shrink-0 w-6">
            <InputBase
              fullWidth
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
              }}
            />
          </div>
        </div>
        <div>
          <Button variant="outlined" onClick={handleClickSave}>
            保存
          </Button>
        </div>
      </header>
      <Table tableData={collectionData} getCollectionData={getCollectionData} />
    </div>
  )
}
