"use client"
import React from "react"
import useSWRMutation from "swr/mutation"
import { reqGetSubsection } from "../../api"
import { useSearchParams } from "next/navigation"
import { TypeSubsectionData } from "../../types"
import { Spin } from "antd"
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
    title: "是否前缀",
    dataIndex: "is_prefix",
    key: "is_prefix",
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

  const [tableLoading, setTableLoading] = React.useState(false)

  const [tableData, setTableData] = React.useState<TypeSubsectionData[]>([])

  const getSubSection = async () => {
    try {
      setTableLoading(true)
      const res = await getSubSectionApi({
        parent_id: JSON.stringify([+searchParams.get("id")!]) as string,
      })
      const newArr = changeTreeArr(res)
      setTableData(newArr)
    } finally {
      setTimeout(() => {
        setTableLoading(false)
      }, 500)
    }
  }

  React.useEffect(() => {
    getSubSection()
  }, [])

  // 渲染表格行

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

  const handleGetParentChildren = async (parentIndexArr: string[]) => {
    if (parentIndexArr[0] == "" || parentIndexArr[0] == undefined) {
      getSubSectionApi({ parent_id: JSON.stringify([+searchParams.get("id")!]) as string }).then(
        (res) => {
          if (res) {
            const newArr = changeTreeArr(res)
            setTableData(newArr)
          }
        },
      )
    } else {
      // 获取到父级节点
      const parentItem = eval(`tableData[${parentIndexArr.join("].children[")}]`)
      // 获取父级的数据
      const res = await getSubSectionApi({
        parent_id: JSON.stringify([parentItem.id]),
      })

      handleRenderTreeChildren(res, parentItem.key as string)
    }
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
    }, 500)
  }

  const renderTableTr = (arr: TypeSubsectionData[]) => {
    return arr.map((item) => (
      <TableTr
        key={item.id}
        item={item}
        handleExpandOrClose={handleExpandOrClose}
        handleGetParentChildren={handleGetParentChildren}>
        {!item.isCloseChildren &&
          item.children &&
          item.children.length > 0 &&
          renderTableTr(item.children)}
      </TableTr>
    ))
  }

  return (
    <>
      <h3 className="font-bold text-[1.875rem]">分部分项模板</h3>
      <div className="mb-9 mt-7">
        <Breadcrumbs aria-label="breadcrumb" separator=">">
          <Link underline="hover" color="inherit" href="/">
            <i className="iconfont icon-homefill" style={{ fontSize: "14px" }}></i>
          </Link>
          <Link underline="hover" color="inherit" href="/engineering" sx={{ fontSize: "14px" }}>
            工程专业列表
          </Link>
          <Typography color="text.primary" sx={{ fontSize: "14px" }}>
            分部分项模板
          </Typography>
        </Breadcrumbs>
      </div>
      <div className="flex-1 flex-shrink-0 overflow-auto bg-white custom-scroll-bar shadow">
        <Spin spinning={tableLoading}>
          <table className="w-full h-full border-spacing-0 border-separate custom-table table-fixed">
            <thead className="bg-[#fafafa] h-12 text-sm sticky top-0 z-40">
              <tr className="grid grid-cols-6 h-full border-b bg-white">
                {columns.map((col, index) => (
                  <th
                    className={` flex items-center justify-center ${
                      index == 0 ? "col-span-3" : ""
                    }`}
                    key={col.dataIndex}>
                    {col.title}
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
