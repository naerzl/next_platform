"use client"
import React from "react"
import { Button, Input, Table } from "antd"
import useSWRMutation from "swr/mutation"
import { ColumnsType } from "antd/es/table"
import { useRouter } from "next/navigation"
import { reqGetEBS } from "@/app/ebs-data/api"
import { TypeEBSDataList } from "@/app/ebs-data/types"
import dayjs from "dayjs"
import { Breadcrumbs } from "@mui/material"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"

export default function DesignDataListPage() {
  const router = useRouter()

  const { trigger: getEBSApi } = useSWRMutation("/ebs", reqGetEBS)

  const [tableList, setTableList] = React.useState<TypeEBSDataList[]>([])

  // 页面加载获取数据
  React.useEffect(() => {
    getEBSApi({ level: 1 }).then((res) => {
      if (res) {
        setTableList(res || [])
      }
    })
  }, [])

  // 表格配置列
  const columns: ColumnsType<TypeEBSDataList> = [
    {
      title: "编号",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "模板名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
      render(_, record) {
        return (
          <div className="flex justify-between">
            {dayjs(record.created_at).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        )
      },
    },
    {
      title: "修改时间",
      dataIndex: "updated_at",
      key: "updated_at",
      render(_, record) {
        return (
          <div className="flex justify-between">
            {record.updated_at ? dayjs(record.updated_at).format("YYYY-MM-DD HH:mm:ss") : ""}
          </div>
        )
      },
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
                router.push(`/design-data?code=${record.code}`)
              }}>
              进入
            </Button>
          </div>
        )
      },
    },
  ]

  const handleClickSearch = (value: string) => {
    getEBSApi({ level: 1, name: value }).then((res) => {
      if (res) {
        setTableList(res || [])
      }
    })
  }

  return (
    <>
      <h3 className="font-bold text-[1.875rem]">设计数据列表</h3>
      <Breadcrumbs aria-label="breadcrumb" className="my-2">
        <Link underline="hover" color="inherit" href="/">
          首页
        </Link>
        <Typography color="text.primary">设计数据列表</Typography>
      </Breadcrumbs>
      <div className="flex-1 flex-shrink-0 overflow-auto bg-white">
        <header className="flex justify-between mb-4">
          <div>
            <Input.Search
              size="large"
              placeholder="搜索模板名称"
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
