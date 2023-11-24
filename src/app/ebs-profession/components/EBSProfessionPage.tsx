"use client"
import React from "react"
import { reqGetEBS } from "@/app/ebs-profession/ebs-data/api"
import dayjs from "dayjs"
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
import useSWR from "swr"
import permissionJson from "@/config/permission.json"
import NoPermission from "@/components/NoPermission"
import { LayoutContext } from "@/components/LayoutContext"

export default function ebsProfessionPage() {
  const { permissionTagList } = React.useContext(LayoutContext)

  const [swrState, setSwrState] = React.useState({
    level: 1,
    name: "",
  })

  const { data: tableList, isLoading } = useSWR(
    swrState["level"] ? `/ebs?level=${swrState["level"]}&name=${swrState["name"]}` : null,
    (url) => reqGetEBS(url, { arg: { level: swrState["level"], name: swrState["name"] } }),
  )

  // 页面加载获取数据
  React.useEffect(() => {
    setSwrState((prevState) => ({ ...prevState, level: 1 }))
  }, [])

  // 表格配置列
  const columns = [
    {
      title: "编号",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "EBS专业名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "修改时间",
      dataIndex: "updated_at",
      key: "updated_at",
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

  const DOM_THEAD = React.useRef<HTMLTableSectionElement>(null)

  const THEAD_POSITION = React.useRef<DOMRect>({} as DOMRect)
  React.useEffect(() => {
    THEAD_POSITION.current = DOM_THEAD.current?.getBoundingClientRect() as DOMRect
  }, [])

  if (!permissionTagList.includes(permissionJson.list_of_ebs_majors_member_read)) {
    return <NoPermission />
  }

  return (
    <>
      <h3 className="font-bold text-[1.875rem]">EBS专业列表</h3>
      <div className="mb-9 mt-7">
        <Breadcrumbs aria-label="breadcrumb" separator=">">
          <Link underline="hover" color="inherit" href="/dashboard">
            <i className="iconfont icon-homefill" style={{ fontSize: "14px" }}></i>
          </Link>
          <Typography color="text.primary" sx={{ fontSize: "14px" }}>
            EBS专业列表
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
      <div className="bg-white border custom-scroll-bar shadow-sm flex-1 overflow-y-auto">
        <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
          <TableHead sx={{ position: "sticky", top: "0", zIndex: 5 }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key} sx={{ width: col.key == "action" ? "150px" : "auto" }}>
                  {col.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              tableList?.map((row) => (
                <TableRow key={row.code} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.code}
                  </TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">
                    <div className="flex justify-between">
                      {row.created_at ? dayjs(row.created_at).format("YYYY-MM-DD HH:mm:ss") : ""}
                    </div>
                  </TableCell>
                  <TableCell align="left">
                    <div className="flex justify-between">
                      {row.updated_at ? dayjs(row.updated_at).format("YYYY-MM-DD HH:mm:ss") : ""}
                    </div>
                  </TableCell>
                  <TableCell align="left">
                    <div className="flex justify-between">
                      <Button className="py-1.5 pl-1 pr-2 bg-railway_blue text-white">
                        <div
                          onClick={() => {
                            window.open(`/ebs-profession/ebs-data?code=${row.code}`)
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
        {isLoading && (
          <div className="w-full h-full flex  justify-center items-center px-5">
            <CircularProgress />
          </div>
        )}
      </div>
    </>
  )
}
