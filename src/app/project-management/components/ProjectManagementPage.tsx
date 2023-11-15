"use client"
import React from "react"
import { Breadcrumbs, Button, InputBase } from "@mui/material"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import Table from "@mui/material/Table"
import Loading from "@/components/loading"
import useSWRMutation from "swr/mutation"
import { dateToYYYYMM } from "@/libs/methods"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import { useConfirmationDialog } from "@/components/ConfirmationDialogProvider"
import { message } from "antd"
import IconButton from "@mui/material/IconButton"
import SearchIcon from "@mui/icons-material/Search"

import { reqDelProject, reqGetProject } from "@/app/project-management/api"
import { ProjectListData } from "@/app/project-management/types"
import { useAddOrEditProject } from "@/app/project-management/hooks/useAddOrEditProject"
import AddOrEditProject from "@/app/project-management/components/AddOrEditProject"

// 表格配置列
const columns = [
  {
    title: "项目名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "创建者",
    dataIndex: "creator",
    key: "creator",
  },

  {
    title: "项目简称",
    dataIndex: "abbreviation",
    key: "abbreviation",
  },

  {
    title: "工程造价",
    dataIndex: "cost",
    key: "cost",
  },
  {
    title: "平台项目过期时间",
    dataIndex: "expired_at",
    key: "expired_at",
  },
  {
    title: "项目开始时间",
    dataIndex: "started_at",
    key: "started_at",
  },
  {
    title: "操作",
    key: "action",
  },
]

export default function ProjectManagementPage() {
  const { trigger: getProjectApi, isMutating } = useSWRMutation("/project", reqGetProject)

  const { trigger: delProjectApi } = useSWRMutation("/project", reqDelProject)

  const [projectDataList, setProjectDataList] = React.useState<ProjectListData[]>([])
  const getProjectDataList = async () => {
    const res = await getProjectApi({ page: 1, limit: 50 })
    setProjectDataList(res.items || [])
  }

  React.useEffect(() => {
    getProjectDataList()
  }, [])

  const {
    handleAddProject,
    handleEditProject,
    handleCloseProjectWithDrawer,
    drawerOpen,
    editItem,
  } = useAddOrEditProject()

  const { showConfirmationDialog } = useConfirmationDialog()

  const handleDelProject = (item: ProjectListData) => {
    showConfirmationDialog("确定删除吗？", async () => {
      await delProjectApi({ id: item.id, name: item.name })
      message.success("操作成功")
      getProjectDataList()
    })
  }
  return (
    <>
      <h3 className="font-bold text-[1.875rem]">项目管理</h3>
      <div className="mb-9 mt-7">
        <Breadcrumbs aria-label="breadcrumb" separator=">">
          <Link underline="hover" color="inherit" href="/dashboard">
            <i className="iconfont icon-homefill" style={{ fontSize: "14px" }}></i>
          </Link>
          <Typography color="text.primary" sx={{ fontSize: "14px" }}>
            项目管理
          </Typography>
        </Breadcrumbs>
      </div>
      <header className="flex justify-between mb-4">
        <div className="flex gap-x-2"></div>
        <div></div>
      </header>
      {isMutating ? (
        <Loading />
      ) : (
        <div className="bg-white border custom-scroll-bar shadow-sm flex-1 overflow-y-auto">
          <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
            <TableHead sx={{ position: "sticky", top: "0", zIndex: 5 }}>
              <TableRow>
                {columns.map((col, index) => (
                  <TableCell key={index} sx={{ width: col.key == "action" ? "210px" : "auto" }}>
                    {col.title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {projectDataList.map((row) => (
                <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }} key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="left">{row.creator}</TableCell>
                  <TableCell align="left">{row.abbreviation}</TableCell>
                  <TableCell align="left">{row.cost}</TableCell>
                  <TableCell align="left">{dateToYYYYMM(row.expired_at)}</TableCell>
                  <TableCell align="left">{dateToYYYYMM(row.started_at)}</TableCell>
                  <TableCell align="left">
                    <div className="flex justify-between">
                      <Button
                        variant="outlined"
                        onClick={() => {
                          handleEditProject(row)
                        }}
                        startIcon={<EditOutlinedIcon />}>
                        编辑
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          handleDelProject(row)
                        }}
                        startIcon={<DeleteOutlineIcon />}>
                        删除
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {drawerOpen && (
        <AddOrEditProject
          editItem={editItem}
          open={drawerOpen}
          close={handleCloseProjectWithDrawer}
          getDataList={getProjectDataList}
        />
      )}
    </>
  )
}
