"use client"
import React from "react"
import { Dropdown, Input, MenuProps, Table, Tag } from "antd"
import useSWRMutation from "swr/mutation"
import { ColumnsType } from "antd/es/table"
import { useRouter } from "next/navigation"
import { reqGetEBS } from "@/app/ebs-data/api"
import { TypeEBSDataList } from "@/app/ebs-data/types"
import dayjs from "dayjs"
import { Breadcrumbs } from "@mui/material"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import LayoutContext from "@/app/context/LayoutContext"

export default function DesignDataListPage() {
  const router = useRouter()

  const { trigger: getEBSApi } = useSWRMutation("/ebs", reqGetEBS)

  const [tableList, setTableList] = React.useState<TypeEBSDataList[]>([])

  const [tableLoading, setTableLoading] = React.useState(false)
  // 页面加载获取数据
  React.useEffect(() => {
    setTableLoading(true)
    getEBSApi({ level: 1 })
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

  const [handleItem, setHandleItem] = React.useState<TypeEBSDataList>({} as TypeEBSDataList)
  const handleClickMenu1 = () => {
    router.push(`/design-data?code=${handleItem.id}`)
  }

  const handleDropOpen = (open: boolean, record: TypeEBSDataList) => {
    open ? setHandleItem(record) : setHandleItem({} as TypeEBSDataList)
  }

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <span onClick={handleClickMenu1}>进入</span>,
    },
  ]

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
              <Tag className="py-1.5 pl-1 pr-2" color="#0162B1">
                <div
                  onClick={() => {
                    // router.push(`/design-data?code=${record.id}`)
                    window.open(`/design-data?code=${record.id}`)
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

  const handleClickSearch = (value: string) => {
    setTableLoading(true)
    getEBSApi({ level: 1, name: value })
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

  const DOM_THEAD = React.useRef<HTMLTableSectionElement>(null)

  return (
    <>
      <h3 className="font-bold text-[1.875rem]">设计数据列表</h3>
      <div className="mb-9 mt-7">
        <Breadcrumbs aria-label="breadcrumb" separator=">">
          <Link underline="hover" color="inherit" href="/">
            <i className="iconfont icon-homefill" style={{ fontSize: "14px" }}></i>
          </Link>
          <Typography color="text.primary" sx={{ fontSize: "14px" }}>
            设计数据列表
          </Typography>
        </Breadcrumbs>
      </div>
      <header className="flex justify-end mb-6">
        <div>
          <Input.Search
            className="shadow"
            size="large"
            placeholder="搜索模板名称"
            onSearch={(value: string) => {
              handleClickSearch(value)
            }}></Input.Search>
        </div>
      </header>
      <div className=" bg-white border custom-scroll-bar shadow-sm">
        <div>
          <Table
            sticky
            ref={DOM_THEAD}
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
