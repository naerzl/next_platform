"use client"
import React from "react"
import useSWRMutation from "swr/mutation"
import { reqDeleteEBSTags, reqGetCollection, reqGetEBSTags, reqPostAddEBSTags } from "../api"
import DesignDataContext from "../context/useDesignData"
import { ReqPostEBSAddTagsResponce } from "../types"
import CloseIcon from "@mui/icons-material/Close"
import MainHeader from "./MainHeader"
import DataList from "./DataList"
import { MenuItem, Select } from "@mui/material"
import Empty from "@/components/Empty"
import Link from "next/link"

interface Props {
  // eslint-disable-next-line no-unused-vars
  getSubEBSList: (value: string, allIndex?: number[], ifFlag?: boolean) => void
}

export default function main(props: Props) {
  const { getSubEBSList } = props
  // 全局共享上下文数据
  const ctx = React.useContext(DesignDataContext)

  // 获取单个EBS拥有的标签
  const { trigger: getIsHaveTagsListApi } = useSWRMutation("/ebs-material-structure", reqGetEBSTags)

  // 控制新增按钮和input的切换
  const [showInput, setShowInput] = React.useState(false)
  // 标签数组列表
  const [tags, setTags] = React.useState<ReqPostEBSAddTagsResponce[]>([])

  // 获取列表
  const getEBSTagsList = async () => {
    const res = await getIsHaveTagsListApi({ ebs_id: Number(ctx.ebs_id) })
    setTags(res || [])
  }

  // 页面加载获取所拥有的标签
  React.useEffect(() => {
    if (ctx.ebs_id) {
      getEBSTagsList()
      setSelectTags(0)
    }
  }, [ctx.ebs_id])

  // 删除接口
  const { trigger: deleteTagsApi } = useSWRMutation("/ebs-material-structure", reqDeleteEBSTags)

  // 删除tag标签事件
  const handleClickDelTag = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    id: number,
  ) => {
    e.stopPropagation()
    await deleteTagsApi({ ebs_id: Number(ctx.ebs_id), id })
    getEBSTagsList()
  }

  // 获取结构集合
  const { trigger: getCollectionApi } = useSWRMutation("/structure-collection", reqGetCollection)
  // 获取全部的
  const [allTagsList, setAllTagsList] = React.useState<{ id: number; name: string }[]>([])

  // 处理切换input显示隐藏事件
  const handleChangeShowInput = async () => {
    const res = await getCollectionApi({})
    setAllTagsList(res || [])
    setShowInput(true)
  }

  let timer = -1
  // 双击标签事件

  // 单击选中的标签
  const [selectTag, setSelectTags] = React.useState(0)
  // 点击标签事件
  const handleTagClick = (id: number) => {
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      setSelectTags(id)
    }, 500)
  }

  // 添加EBS标签
  const { trigger: postAddEBSTagsApi } = useSWRMutation(
    "/ebs-material-structure",
    reqPostAddEBSTags,
  )

  const handleChangeSelectTag = async (e: any) => {
    const obj = allTagsList.find((item) => item.id == e.target.value)
    if (obj) {
      const res = await postAddEBSTagsApi({ collection_id: obj.id, ebs_id: ctx.ebs_id as number })
      getEBSTagsList()
      setSelectTags(res.id)
      setShowInput(false)
      const strArr = ctx.treeStr.split("-")
      getSubEBSList(strArr[0], strArr.slice(2) as any, true)
    }
  }

  return (
    <div className="h-full p-3">
      <MainHeader />
      <hr />
      <div className="overflow-y-auto mt-2">
        {/* 标签 */}
        <div className="w-full  h-12  flex items-center text-[0.875rem] text-center  gap-x-2 ">
          <div
            className={`w-28 p-2 bg-gray-200 rounded-lg cursor-pointer shrink-0`}
            style={selectTag == 0 ? { textDecoration: "underline", color: "#0162B1" } : {}}
            onClick={() => {
              handleTagClick(0)
            }}>
            基础数据
          </div>

          {tags.map((tag) => (
            <div key={tag.id}>
              <div
                className="w-28 p-2 bg-gray-200 rounded-lg cursor-pointer relative tags_box shrink-0"
                style={selectTag == tag.id ? { textDecoration: "underline", color: "#0162B1" } : {}}
                onClick={() => {
                  handleTagClick(tag.id)
                }}>
                {tag.name}
                <span
                  className="h-3 aspect-square  items-center justify-center rounded-full bg-[#909399] top-0 right-0 tags_item  hidden absolute"
                  onClick={(e) => handleClickDelTag(e, tag.id)}>
                  <CloseIcon sx={{ fontSize: "0.75rem" }} />
                </span>
              </div>
            </div>
          ))}

          {showInput ? (
            <div className="w-40 p-2 bg-gray-200 rounded-lg cursor-pointer shrink-0">
              <Select
                displayEmpty
                autoFocus
                size="small"
                className="w-full h-full"
                placeholder="请选择表结构数据"
                onChange={(e) => {
                  handleChangeSelectTag(e)
                }}
                onClose={() => {
                  setShowInput(false)
                }}>
                {allTagsList.length > 0 ? (
                  allTagsList.map((item) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
                    </MenuItem>
                  ))
                ) : (
                  <Empty
                    className="w-full h-full flex flex-col justify-center items-center"
                    fontSize="2rem"
                    color="#dce0e6"
                    text={
                      <div className="text-[12px]">
                        <span>没有可选项，</span>
                        <Link href="/collection" className="text-railway_blue">
                          去添加
                        </Link>
                      </div>
                    }
                  />
                )}
              </Select>
            </div>
          ) : (
            <div
              className="w-28 p-2 bg-gray-200 rounded-lg cursor-pointer shrink-0"
              onClick={handleChangeShowInput}>
              +
            </div>
          )}
        </div>
        {/* 数据 */}
        <DataList selectTag={selectTag} getSubEBSList={getSubEBSList} />

        {/* 添加基础数据表单 */}
      </div>
    </div>
  )
}
