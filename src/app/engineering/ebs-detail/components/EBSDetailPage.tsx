"use client"
import React from "react"
import useSWRMutation from "swr/mutation"
import { reqGetSubsection } from "../../api"
import { useSearchParams } from "next/navigation"
import { TypeSubsectionData } from "../../types"
import { Button, Spin } from "antd"
import TableTr from "./TableTr"
import { Breadcrumbs } from "@mui/material"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"

// 表格每一列的字段
const columns = [
  {
    title: "分部、分项、检验批划分",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "编码",
    dataIndex: "code",
    key: "code",
  },

  {
    title: "节点分类",
    dataIndex: "subpart_type",
    key: "subpart_type",
  },
  {
    title: "节点归属",
    dataIndex: "subpart_class",
    key: "subpart_class",
  },
  {
    title: "是否前缀",
    dataIndex: "is_prefix",
    key: "is_prefix",
  },
  {
    title: "操作",
    dataIndex: "操作",
    key: "操作",
    render() {
      return (
        <div>
          <Button type="primary" className="bg-railway_blue">
            保存
          </Button>
        </div>
      )
    },
  },
]

// 转换数据 添加自定义字段 key
const changeTreeArr = (arr: TypeSubsectionData[], indexStr = ""): TypeSubsectionData[] => {
  if (!arr) arr = []
  return arr.map((item, index) => {
    let str = indexStr ? `${indexStr}-${index}` : `${index}`
    return {
      ...item,
      key: str,
      children: changeTreeArr(item.children as TypeSubsectionData[], str),
    }
  })
}

export default function EBSDetailPage() {
  // 获取表格数据SWR请求
  const { trigger: getSubSectionApi } = useSWRMutation("/subsection", reqGetSubsection)

  const searchParams = useSearchParams()

  const [tableData, setTableData] = React.useState<TypeSubsectionData[]>([])
  const getSubSection = async () => {
    const res = await getSubSectionApi({
      parent_id: JSON.stringify([+searchParams.get("id")!]) as string,
    })
    const newArr = changeTreeArr(res)
    setTableData(newArr)
  }

  React.useEffect(() => {
    getSubSection()
  }, [])

  const [tableLoading, setTableLoading] = React.useState(false)

  // 渲染表格行
  const renderTableTr = (arr: TypeSubsectionData[]) => {
    return arr.map((item) => (
      <TableTr key={item.id} item={item} handleExpandOrClose={handleExpandOrClose}>
        {!item.isCloseChildren &&
          item.children &&
          item.children.length > 0 &&
          renderTableTr(item.children)}
      </TableTr>
    ))
  }

  const handleRenderTreeChildren = (data: TypeSubsectionData[], indexStr: string) => {
    const newData = structuredClone(tableData)
    const indexArr = indexStr.split("-")
    const str = `newData[${indexArr.join("].children[")}]`
    if (data.length <= 0) eval(str + ".noChildren=true")
    eval(str + ".children=data")
    eval(str + ".isCloseChildren=false")
    const newArr = changeTreeArr(newData)
    setTableData(newArr)
  }

  // 切换节点关闭方法
  const renderTreeArrOfCloseChildren = (indexStr: string) => {
    const newData = structuredClone(tableData)
    const indexArr = indexStr.split("-")
    const str = `newData[${indexArr.join("].children[")}].isCloseChildren`
    eval(str + "=true")
    setTableData(newData)
  }

  const handleExpandOrClose = async (expand: boolean, record: TypeSubsectionData) => {
    setTableLoading(true)
    // 判断是展开还是关闭
    if (expand) {
      const res = await getSubSectionApi({ parent_id: JSON.stringify([record.id]) })
      handleRenderTreeChildren(res, record.key as string)
    } else {
      renderTreeArrOfCloseChildren(record.key as string)
    }
    setTimeout(() => {
      setTableLoading(false)
    }, 800)
  }

  return (
    <>
      <h3 className="font-bold text-[1.875rem]">分部分项模板</h3>
      <Breadcrumbs aria-label="breadcrumb" className="my-2">
        <Link underline="hover" color="inherit" href="/">
          工程专业列表
        </Link>
        <Link underline="hover" color="inherit" href="/engineering">
          首页
        </Link>
        <Typography color="text.primary">分部分项模板</Typography>
      </Breadcrumbs>
      <div className="flex-1 flex-shrink-0 overflow-auto bg-white">
        <Spin spinning={tableLoading}>
          <table className="w-full h-full border-spacing-0 border-separate">
            <thead className="bg-[#fafafa] h-12 text-sm">
              <tr className="grid grid-cols-8 h-full">
                {columns.map((col, index) => (
                  <th
                    className={`border flex items-center justify-center ${
                      index == 0 ? "col-span-3" : ""
                    }`}
                    key={col.dataIndex}>
                    {col.render ? col.render() : col.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{renderTableTr(tableData)}</tbody>
          </table>
        </Spin>
      </div>
    </>
  )
}
