import React, { ReactNode } from "react"
import { TypeSubsectionData } from "../../types"

interface Props {
  item: TypeSubsectionData
  children?: ReactNode
  // eslint-disable-next-line no-unused-vars
  handleExpandOrClose: (expand: boolean, record: TypeSubsectionData) => Promise<void>
}

//节点分类
const EnumNodeClass: { [key: string]: string } = {
  field: "专业",
  subpart: "分部",
  subitem: "分项",
  examination: "检验批",
}

const EnumNodeType: { [key: string]: string } = {
  basic: "基础",
  sync: "同步",
}

function TableTr(props: Props) {
  const { item, handleExpandOrClose } = props

  const handleClickClose = () => {
    handleExpandOrClose(false, item)
  }

  const handleClickExpand = () => {
    handleExpandOrClose(true, item)
  }
  return (
    <>
      <tr className="grid grid-cols-8 h-full border-t border-b">
        <td
          className=" p-4 overflow-hidden cursor-pointer col-span-3 flex justify-between"
          title={item.name}>
          <div
            className="flex-1 flex-shrink-0  overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ textIndent: `${(item.key!.split("-").length - 1) * 12}px` }}>
            {!item.noChildren &&
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
        <td className=" flex justify-center items-center">{EnumNodeType[item.subpart_type]}</td>
        <td className=" flex justify-center items-center">{item.is_prefix == 0 ? "否" : "是"}</td>
        <td className=" flex justify-center items-center"></td>
      </tr>
      {props.children}
    </>
  )
}

export default TableTr
