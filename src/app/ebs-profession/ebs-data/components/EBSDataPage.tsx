"use client"
import React from "react"
import useSWRMutation from "swr/mutation"
import {
  reqGetEBS,
  reqGetCodeCount,
  reqGetEBSCodeRelationship,
} from "@/app/ebs-profession/ebs-data/api"
import { TypeEBSDataList } from "@/app/ebs-profession/ebs-data/types"
import TableTr from "@/app/ebs-profession/ebs-data/components/TableTr"
import EBSDataContext from "@/app/ebs-profession/ebs-data/context/ebsDataContext"
import DialogEBS from "@/app/ebs-profession/ebs-data/components/DialogEBS"
import useEBSDataDialog from "@/hooks/useEBSDataDialog"
import { useSearchParams } from "next/navigation"
import { Breadcrumbs } from "@mui/material"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import LayoutContext from "@/app/context/LayoutContext"

// 表格每一列的字段
const columns = [
  {
    title: "EBS名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "EBS编码",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "单位",
    dataIndex: "unit",
    key: "unit",
  },
  {
    title: "节点归属",
    dataIndex: "节点归属",
    key: "节点归属",
  },
  {
    title: "节点类型",
    dataIndex: "节点类型",
    key: "节点类型",
  },
  {
    title: "高速编码",
    dataIndex: "高速编码",
    key: "高速编码",
  },
  {
    title: "普速编码",
    dataIndex: "普速编码",
    key: "普速编码",
  },
  {
    title: "是否可循环",
    dataIndex: "是否可循环",
    key: "是否可循环",
  },
  {
    title: "关联",
    dataIndex: "关联",
    key: "关联",
  },
  {
    title: "操作",
    dataIndex: "操作",
    key: "操作",
  },
]

// 转换数据 添加自定义字段 key
const changeTreeArr = (arr: TypeEBSDataList[], indexStr = ""): TypeEBSDataList[] => {
  if (!arr) arr = []
  return arr.map((item, index) => {
    let str = indexStr ? `${indexStr}-${index}` : `${index}`
    return { ...item, key: str, children: changeTreeArr(item.children as TypeEBSDataList[], str) }
  })
}

function EBSDataPage() {
  // 获取EBS结构数据
  const { trigger: getEBSApi } = useSWRMutation("/ebs", reqGetEBS)
  const [tableData, setTableData] = React.useState<TypeEBSDataList[]>([])

  const searchParams = useSearchParams()

  const {
    dialogOpen,
    isEdit,
    deletedDataList,
    addType,
    handleAddEBS,
    item,
    changeDialogOpen,
    changeIsEdit,
    handleAddCustomEBS,
    handleEditCustomEBS,
  } = useEBSDataDialog()

  // 页面加载获取数据
  React.useEffect(() => {
    getEBSApi(
      searchParams.get("code")
        ? { level: 1, code: searchParams.get("code") as string }
        : { level: 1 },
    ).then((res) => {
      if (res) {
        const newArr = changeTreeArr(res)
        setTableData(newArr)
      }
    })
  }, [])

  // 渲染节点下面的children 树结构方法
  const renderTreeArr = (data: TypeEBSDataList[], indexStr: string) => {
    const newData = structuredClone(tableData)
    const indexArr = indexStr.split("-")
    const str = `newData[${indexArr.join("].children[")}]`
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

  // 控制表格加载状态
  const [tableLoading, setTableLoading] = React.useState(false)

  const { trigger: getCodeCountApi } = useSWRMutation("/ebs/code-count", reqGetCodeCount)

  // 列表展开合并触发的方法
  const handleExpandChange = async (expanded: boolean, record: TypeEBSDataList) => {
    setTableLoading(true)
    // expanded 为真 即是展开
    if (expanded) {
      const res = await getEBSApi({
        code: record.code,
        level: record.level + 1,
      })

      if (res.length > 0) {
        const codeArr = res.map((item) => item.code)
        // 获取子节点
        const resCount = await getCodeCountApi({
          code: JSON.stringify(codeArr),
          level: record.level + 2,
        })
        if (Object.keys(resCount).length > 0) {
          const childrenArr = res.map((item) => ({
            ...item,
            childrenCount: resCount[String(item.code) as any] || {
              platform: 0,
              system: 0,
              userdefined: 0,
              none: 0,
            },
          }))
          renderTreeArr(childrenArr, record.key as string)
        } else {
          const childrenArr = res.map((item) => ({
            ...item,
            childrenCount: { platform: 0, system: 0, userdefined: 0, none: 0 },
          }))
          renderTreeArr(childrenArr, record.key as string)
        }
      }
    } else {
      renderTreeArrOfCloseChildren(record.key as string)
    }
    setTableLoading(false)
  }

  // 获取父级的子集节点
  const handleGetParentChildren = async (parentIndexArr: string[]) => {
    if (parentIndexArr[0] == "" || parentIndexArr[0] == undefined) {
      getEBSApi({ level: 1, code: searchParams.get("code") as string }).then((res) => {
        if (res) {
          const newArr = changeTreeArr(res)
          setTableData(newArr)
        }
      })
    } else {
      // 获取到父级节点
      const parentItem = eval(`tableData[${parentIndexArr.join("].children[")}]`)
      // 获取父级的数据
      const res = await getEBSApi({
        code: parentItem.code,
        level: parentItem.level + 1,
      })

      renderTreeArr(res, parentItem.key as string)
    }
  }

  const [ebsOption, setEbsOption] = React.useState<any[]>([])

  // 获取EBS指定code或者名称下的相关数据
  const { trigger: getEBSCodeRelationshipApi } = useSWRMutation(
    "/ebs/code-relationship",
    reqGetEBSCodeRelationship,
  )

  const getEBSOption = async (value: string) => {
    if (value) {
      const res = await getEBSCodeRelationshipApi({
        code: searchParams.get("code") as string,
        locate_code_or_name: value,
      })
      if (!res) return
      const newArr = res.map((item) => {
        let str = ""
        if (item.code !== "01") {
          str = item.relationShips
            .map((el: any) => {
              return el.name
            })
            .join("-")
        }
        return {
          ...item,
          value: item.id,
          label: item.code == "01" ? item.name : str,
        }
      })
      setEbsOption(structuredClone(newArr))
    } else {
      setEbsOption([])
    }
  }

  // 渲染表格每一行
  const renderTableTr = (arr: TypeEBSDataList[]) => {
    return arr.map((item) => (
      <TableTr
        item={item}
        key={item.id}
        handleGetParentChildren={handleGetParentChildren}
        handleAddCustomEBS={handleAddCustomEBS}
        handleEditCustomEBS={handleEditCustomEBS}
        handleAddEBS={handleAddEBS}>
        {!item.isCloseChildren &&
          item.children &&
          item.children.length > 0 &&
          renderTableTr(item.children)}
      </TableTr>
    ))
  }

  const DOM_THEAD = React.useRef<HTMLTableSectionElement>(null)

  const THEAD_POSITION = React.useRef<DOMRect>({} as DOMRect)
  React.useEffect(() => {
    THEAD_POSITION.current = DOM_THEAD.current?.getBoundingClientRect() as DOMRect
  }, [])

  return (
    <EBSDataContext.Provider value={{ handleExpandChange, tableData }}>
      <h3 className="font-bold text-[1.875rem]">EBS模板</h3>
      <div className="mb-9 mt-7">
        <Breadcrumbs aria-label="breadcrumb" separator=">">
          <Link underline="hover" color="inherit" href="/">
            <i className="iconfont icon-homefill" style={{ fontSize: "14px" }}></i>
          </Link>
          <Link underline="hover" color="inherit" href="/ebs-profession" sx={{ fontSize: "14px" }}>
            EBS专业列表
          </Link>
          <Typography color="text.primary" sx={{ fontSize: "14px" }}>
            EBS模板
          </Typography>
        </Breadcrumbs>
      </div>
      <div className="bg-white border ">
        <div className="h-full  ebs_data custom-scroll-bar">
          <table className="w-full h-full border-spacing-0 border-separate custom-table table-fixed">
            <thead className="h-12 text-sm sticky top-[64px] z-10" ref={DOM_THEAD}>
              <tr className="grid grid-cols-12 h-full border-b bg-white">
                {columns.map((col, index) => (
                  <th
                    className={`text-left p-4 ${index == 0 ? "col-span-3" : ""}`}
                    key={col.dataIndex}>
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{renderTableTr(tableData)}</tbody>
          </table>
          <DialogEBS
            open={dialogOpen}
            item={item}
            changeDialogOpen={changeDialogOpen}
            deletedDataList={deletedDataList}
            addType={addType}
            isEdit={isEdit}
            handleGetParentChildren={handleGetParentChildren}
            changeIsEdit={changeIsEdit}
            ebsOption={ebsOption}
            getEBSOption={getEBSOption}></DialogEBS>
        </div>
      </div>
    </EBSDataContext.Provider>
  )
}

export default EBSDataPage
