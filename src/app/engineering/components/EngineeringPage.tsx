"use client"
import React from "react"
import { Breadcrumbs, InputAdornment, InputBase, Button, CircularProgress } from "@mui/material"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import IconButton from "@mui/material/IconButton"
import SearchIcon from "@mui/icons-material/Search"
import { reqGetSubsection } from "@/app/engineering/api"
import useSWR from "swr"

export default function ebsProfessionPage() {
  const [swrState, setSwrState] = React.useState({
    parent_id: "",
    name: "",
  })

  const { data: tableList, isLoading } = useSWR(
    swrState["parent_id"]
      ? `/subsection?parent_id=${swrState["parent_id"]}&name=${swrState["name"]}`
      : null,
    (url) =>
      reqGetSubsection(url, { arg: { parent_id: swrState["parent_id"], name: swrState["name"] } }),
  )

  // 页面加载获取数据
  React.useEffect(() => {
    setSwrState((prevState) => ({ ...prevState, parent_id: JSON.stringify([]) }))
  }, [])

  // 表格配置列
  const columns = [
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
    },
    {
      title: "铁路类型",
      dataIndex: "class_name",
      key: "class_name",
      align: "left",
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
    },
  ]

  const handleClickSearch = (value: string) => {
    setSwrState((prevState) => ({ ...prevState, name: value }))
  }

  return (
    <>
      <h3 className="font-bold text-[1.875rem]">工程专业列表</h3>
      <div className="mb-9 mt-7">
        <Breadcrumbs aria-label="breadcrumb" separator=">">
          <Link underline="hover" color="inherit" href="/dashboard">
            <i className="iconfont icon-homefill" style={{ fontSize: "14px" }}></i>
          </Link>
          <Typography color="text.primary" sx={{ fontSize: "14px" }}>
            工程专业列表
          </Typography>
        </Breadcrumbs>
      </div>
      <header className="flex justify-end mb-6">
        <div>
          <InputBase
            className="w-[18.125rem] h-10 border  px-2 shadow bg-white"
            placeholder="搜索模板名称"
            onBlur={(event) => {
              handleClickSearch(event.target.value)
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  type="button"
                  edge="end"
                  sx={{ p: "10px" }}
                  aria-label="search"
                  disableRipple>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </div>
      </header>
      <div className="bg-white border custom-scroll-bar shadow-sm min-h-[570px]">
        <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
          <TableHead sx={{ position: "sticky", top: "64px", zIndex: 5 }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key} sx={{ width: col.key == "action" ? "150px" : "auto" }}>
                  {col.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableList &&
              tableList?.map((row) => (
                <TableRow key={row.code} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.code}
                  </TableCell>
                  <TableCell align="left">铁路</TableCell>
                  <TableCell align="left">
                    <div>{row.is_highspeed == 1 ? "高速" : "普速"}</div>
                  </TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">
                    <div className="flex justify-between">
                      <Button className="py-1.5 pl-1 pr-2 bg-railway_blue text-white">
                        <div
                          onClick={() => {
                            window.open(`/engineering/ebs-detail?id=${row.id}`)
                          }}
                          className="flex items-center cursor-pointer">
                          <ArrowForwardIcon fontSize="small" />
                          <span className="whitespace-nowrap">进入详情</span>
                        </div>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {!tableList && (
          <div className="w-full h-full flex  justify-center items-center px-5">
            <CircularProgress />
          </div>
        )}
      </div>
    </>
  )
}
