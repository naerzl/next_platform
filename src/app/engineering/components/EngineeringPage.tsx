"use client"
import React from "react"
import { Button, Input, Table } from "antd"
import useSWRMutation from "swr/mutation"
import { ColumnsType } from "antd/es/table"
import { useRouter } from "next/navigation"
import { reqGetSubsection } from "../api"
import { TypeSubsectionData } from "../types"
import { Breadcrumbs } from "@mui/material"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"

export default function EngineeringPage() {
  const router = useRouter()

  const { trigger: getSubsectionApi } = useSWRMutation("/subsection", reqGetSubsection)

  const [tableList, setTableList] = React.useState<TypeSubsectionData[]>([])

  // 页面加载获取数据
  React.useEffect(() => {
    getSubsectionApi({ parent_id: JSON.stringify([]) }).then((res) => {
      if (res) {
        setTableList(res || [])
      }
    })
  }, [])

  // 表格配置列
  const columns: ColumnsType<TypeSubsectionData> = [
    {
      title: "编号",
      dataIndex: "code",
      key: "code",
      align: "center",
    },
    {
      title: "行业名称",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",

      render() {
        return <div>铁路</div>
      },
    },
    {
      title: "铁路类型",
      dataIndex: "class_name",
      key: "class_name",
      align: "center",
      render(_, record) {
        return <div>{record.is_highspeed == 1 ? "高速" : "普速"}</div>
      },
    },
    {
      align: "center",
      title: "专业名称",
      dataIndex: "name",
      key: "name",
    },

    {
      width: "90px",
      title: "操作",
      key: "action",
      render(_, record) {
        return (
          <div className="flex justify-between">
            <Button
              className="bg-railway_blue"
              type="primary"
              onClick={() => {
                router.push(`/engineering/ebs-detail?id=${record.id}`)
              }}>
              进入
            </Button>
          </div>
        )
      },
    },
  ]

  // 处理搜索事件
  const handleClickSearch = (value: string) => {
    getSubsectionApi({ parent_id: JSON.stringify([]), name: value }).then((res) => {
      if (res) {
        setTableList(res || [])
      }
    })
  }

  return (
    <>
      <h3 className="font-bold text-[1.875rem]">工程专业列表</h3>
      <Breadcrumbs aria-label="breadcrumb" className="my-2">
        <Link underline="hover" color="inherit" href="/">
          首页
        </Link>
        <Typography color="text.primary">工程专业列表</Typography>
      </Breadcrumbs>
      <div className="flex-1 flex-shrink-0 overflow-auto bg-white">
        <header className="flex justify-between mb-4">
          <div>
            <Input.Search
              size="large"
              placeholder="搜索项目名称"
              onSearch={(value: string) => {
                handleClickSearch(value)
              }}></Input.Search>
          </div>
        </header>
        <div>
          <Table columns={columns} dataSource={tableList} rowKey="id" bordered pagination={false} />
        </div>
      </div>
    </>
  )
}
