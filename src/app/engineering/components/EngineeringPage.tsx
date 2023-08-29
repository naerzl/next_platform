"use client"
import React from "react"
import { Select, Input, Table, Pagination, Dropdown, MenuProps, Tag } from "antd"
import useSWRMutation from "swr/mutation"
import { ColumnsType } from "antd/es/table"
import { useRouter } from "next/navigation"
import { reqGetSubsection } from "../api"
import { TypeSubsectionData } from "../types"
import { Breadcrumbs } from "@mui/material"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

export default function EngineeringPage() {
  const router = useRouter()

  const { trigger: getSubsectionApi } = useSWRMutation("/subsection", reqGetSubsection)

  const [tableList, setTableList] = React.useState<TypeSubsectionData[]>([])

  const [tableLoading, setTableLoading] = React.useState(false)

  // 页面加载获取数据
  React.useEffect(() => {
    setTableLoading(true)
    getSubsectionApi({ parent_id: JSON.stringify([]) })
      .then((res) => {
        if (res) {
          setTableList(res || [])
        }
      })
      .finally(() => {
        setTimeout(() => {
          setTableLoading(false)
        }, 500)
      })
  }, [])

  const [handleItem, setHandleItem] = React.useState<TypeSubsectionData>({} as TypeSubsectionData)
  const handleClickMenu1 = () => {
    router.push(`/engineering/ebs-detail?id=${handleItem.id}`)
  }

  const handleDropOpen = (open: boolean, record: TypeSubsectionData) => {
    open ? setHandleItem(record) : setHandleItem({} as TypeSubsectionData)
  }

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div onClick={handleClickMenu1} className="flex items-center">
          <ArrowForwardIcon fontSize="small" /> <span>进入详情</span>
        </div>
      ),
    },
  ]

  // 表格配置列
  const columns: ColumnsType<TypeSubsectionData> = [
    {
      title: "编号",
      dataIndex: "code",
      key: "code",
      align: "left",
    },
    {
      title: "行业名称",
      dataIndex: "created_at",
      key: "created_at",
      align: "left",

      render() {
        return <div>铁路</div>
      },
    },
    {
      title: "铁路类型",
      dataIndex: "class_name",
      key: "class_name",
      align: "left",
      render(_, record) {
        return <div>{record.is_highspeed == 1 ? "高速" : "普速"}</div>
      },
    },
    {
      align: "left",
      title: "专业名称",
      dataIndex: "name",
      key: "name",
    },

    {
      width: "150px",
      title: "操作",
      key: "action",
      render(_, record) {
        return (
          <div className="flex justify-between">
            {items.length > 1 ? (
              <Dropdown
                overlayStyle={{ borderRadius: "0", boxShadow: "none" }}
                placement="bottom"
                menu={{ items }}
                onOpenChange={(open) => {
                  handleDropOpen(open, record)
                }}>
                <i className="iconfont icon-gengduo text-[1.25rem]"></i>
              </Dropdown>
            ) : (
              <Tag className="py-1.5 px-1">
                <div
                  onClick={() => {
                    router.push(`/engineering/ebs-detail?id=${record.id}`)
                  }}
                  className="flex items-center cursor-pointer">
                  <ArrowForwardIcon fontSize="small" />
                  <span className="whitespace-nowrap">进入详情</span>
                </div>
              </Tag>
            )}
          </div>
        )
      },
    },
  ]

  // 处理搜索事件
  const handleClickSearch = (value: string) => {
    setTableLoading(true)
    getSubsectionApi({ parent_id: JSON.stringify([]), name: value })
      .then((res) => {
        if (res) {
          setTableList(res || [])
        }
      })
      .finally(() => {
        setTimeout(() => {
          setTableLoading(false)
        }, 500)
      })
  }

  return (
    <>
      <h3 className="font-bold text-[1.875rem]">工程专业列表</h3>
      <div className="mb-9 mt-7">
        <Breadcrumbs aria-label="breadcrumb" separator=">">
          <Link underline="hover" color="inherit" href="/">
            <i className="iconfont icon-homefill" style={{ fontSize: "14px" }}></i>
          </Link>
          <Typography color="text.primary" sx={{ fontSize: "14px" }}>
            工程专业列表
          </Typography>
        </Breadcrumbs>
      </div>
      <header className="flex  mb-6 justify-between">
        <div></div>
        <div>
          <Input.Search
            className="rounded-none shadow "
            size="large"
            placeholder="搜索专业名称"
            onSearch={(value: string) => {
              handleClickSearch(value)
            }}></Input.Search>
        </div>
      </header>
      <div className="custom-scroll-bar  shadow">
        <div className="bg-white">
          <Table
            sticky
            loading={tableLoading}
            columns={columns}
            dataSource={tableList}
            rowKey="id"
            pagination={false}
            className="custom-table"
          />
        </div>
      </div>
    </>
  )
}
