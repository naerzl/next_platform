import React, { ReactNode } from "react"
import { TypeSubsectionData } from "../../types"
import { Switch } from "@mui/material"
import { reqPutSubsection } from "@/app/engineering/api"
import useSWRMutation from "swr/mutation"

interface Props {
  item: TypeSubsectionData
  children?: ReactNode
  // eslint-disable-next-line no-unused-vars
  handleExpandOrClose: (expand: boolean, record: TypeSubsectionData) => Promise<void>
  // eslint-disable-next-line no-unused-vars
  handleGetParentChildren: (parentIndexArr: string[]) => void
}

//节点分类
const EnumNodeClass: { [key: string]: string } = {
  field: "专业",
  subpart: "分部",
  subitem: "分项",
  examination: "检验批",
}

export default function tableTr(props: Props) {
  const { item, handleExpandOrClose } = props

  const handleClickClose = () => {
    handleExpandOrClose(false, item)
  }

  const handleClickExpand = () => {
    handleExpandOrClose(true, item)
  }

  const { trigger: putSubsectionApi } = useSWRMutation("/subsection", reqPutSubsection)
  const handleClickSwitch = async (checked: boolean) => {
    await putSubsectionApi({ is_prefix: checked ? 1 : 0, id: item.id })
    // const parentIndexArr = item.key?.split("-").slice(0, item.key?.split("-").length - 1)
    // handleGetParentChildren(parentIndexArr as string[])
  }

  return (
    <>
      <tr className="grid grid-cols-6 h-full  border-b">
        <td
          className=" p-4 overflow-hidden cursor-pointer col-span-3 flex justify-between"
          title={item.name}>
          <div
            className="flex-1 flex-shrink-0  overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ textIndent: `${(item.key!.split("-").length - 1) * 12}px` }}>
            {item.key!.split("-").length <= 1 &&
              (props.children ? (
                <i
                  className="iconfont  icon-xiangxiajiantou  text-[14px] font-bold mr-1.5"
                  onClick={() => {
                    handleClickClose()
                  }}></i>
              ) : (
                <i
                  className="iconfont icon-xiangyoujiantou text-[14px] font-bold mr-1.5"
                  onClick={() => {
                    handleClickExpand()
                  }}></i>
              ))}

            <span>{item.name}</span>
          </div>
        </td>
        <td className=" flex justify-center items-center">{item.code}</td>
        <td className=" flex justify-center items-center">{EnumNodeClass[item.subpart_class]}</td>
        <td className=" flex justify-center items-center ebs_data">
          <Switch
            defaultChecked={item.is_prefix == 1}
            onChange={(event, checked) => {
              handleClickSwitch(checked)
            }}></Switch>
        </td>
      </tr>
      {props.children}
    </>
  )
}
