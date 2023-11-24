"use client"
import React from "react"
import { Breadcrumbs, Button, InputBase, Pagination } from "@mui/material"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import Table from "@mui/material/Table"
import Loading from "@/components/loading"
import useSWRMutation from "swr/mutation"
import { dateToUTCCustom, dateToYYYYMM, displayWithPermission } from "@/libs/methods"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import { useConfirmationDialog } from "@/components/ConfirmationDialogProvider"
import { message } from "antd"
import IconButton from "@mui/material/IconButton"
import SearchIcon from "@mui/icons-material/Search"
import MoreTimeIcon from "@mui/icons-material/MoreTime"
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined"
import { reqDelProject, reqGetProject } from "@/app/project-management/api"
import { GetProjectParams, ProjectListData } from "@/app/project-management/types"
import { useAddOrEditProject } from "@/app/project-management/hooks/useAddOrEditProject"
import AddOrEditProject from "@/app/project-management/components/AddOrEditProject"
import { TYPE_CLASS } from "../const"
import permissionJson from "@/config/permission.json"
import NoPermission from "@/components/NoPermission"
import { LayoutContext } from "@/components/LayoutContext"
import { BasePager } from "@/types/api"

// 表格配置列
const columns = [
  {
    title: "项目全称",
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
    title: "工程造价（元）",
    dataIndex: "cost",
    key: "cost",
  },

  {
    title: "状态",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "平台项目过期时间",
    dataIndex: "expired_at",
    key: "expired_at",
  },
  {
    title: "平台项目开始时间",
    dataIndex: "started_at",
    key: "started_at",
  },
  {
    title: "操作",
    key: "action",
  },
]

export default function ProjectManagementPage() {
  const { permissionTagList } = React.useContext(LayoutContext)
  const { trigger: getProjectApi, isMutating } = useSWRMutation("/project", reqGetProject)

  const { trigger: delProjectApi } = useSWRMutation("/project", reqDelProject)

  const [projectDataList, setProjectDataList] = React.useState<ProjectListData[]>([])
  const [pager, setPager] = React.useState<BasePager>({} as BasePager)
  const [swrState, setSWRState] = React.useState<GetProjectParams>({
    page: 1,
    limit: 10,
  })

  const getProjectDataList = async () => {
    const res = await getProjectApi(swrState)
    setProjectDataList(res.items || [])
    setPager(res.pager)
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

  const [type, setType] = React.useState<TYPE_CLASS>("zheng")

  const handlePaginationChange = async (val: any, type: keyof GetProjectParams) => {
    let params = {} as GetProjectParams
    for (let swrStateKey in swrState) {
      // @ts-ignore
      if (swrState[swrStateKey] && swrState[swrStateKey] != "null") {
        // @ts-ignore
        params[swrStateKey] = swrState[swrStateKey]
      }
    }
    if (type == "limit") {
      params.page = 1
    }
    // @ts-ignore
    params[type] = val
    setSWRState(params)
    const res = await getProjectApi(params)

    setProjectDataList(res.items)
    setPager(res.pager)
  }

  if (!permissionTagList.includes(permissionJson.item_list_member_read)) {
    return <NoPermission />
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
        <div className="flex-1 relative overflow-hidden border">
          <div className=" bg-white overflow-auto h-full">
            <div className="custom-scroll-bar shadow-sm  overflow-y-auto h-full pb-8">
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
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.creator}</TableCell>
                      <TableCell align="left">{row.abbreviation}</TableCell>
                      <TableCell align="left">{row.cost}</TableCell>
                      <TableCell align="left">
                        {row.class == "official" ? "正式" : "试用"}
                      </TableCell>
                      <TableCell align="left">
                        {row.class == "official"
                          ? "永久"
                          : dateToUTCCustom(row.expired_at, "YYYY-MM-DD")}
                      </TableCell>
                      <TableCell align="left">
                        {dateToUTCCustom(row.created_at, "YYYY-MM-DD")}
                      </TableCell>
                      <TableCell align="left">
                        <div className="flex justify-between">
                          {row.class != "official" && (
                            <>
                              <Button
                                style={displayWithPermission(
                                  permissionTagList,
                                  permissionJson.item_list_member_update,
                                )}
                                variant="outlined"
                                onClick={() => {
                                  handleEditProject(row)
                                  setType("zheng")
                                }}
                                color="success"
                                startIcon={<ChangeCircleOutlinedIcon />}>
                                转正
                              </Button>
                              <Button
                                style={displayWithPermission(
                                  permissionTagList,
                                  permissionJson.item_list_member_update,
                                )}
                                startIcon={<MoreTimeIcon />}
                                variant="outlined"
                                color="warning"
                                onClick={() => {
                                  handleEditProject(row)
                                  setType("yan")
                                }}>
                                延期
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="absolute bottom-0 w-full flex justify-center items-center gap-x-2 bg-white border-t">
                <span>共{pager.count}条</span>
                <select
                  value={swrState.limit}
                  className="border"
                  onChange={(event) => {
                    handlePaginationChange(event.target.value, "limit")
                  }}>
                  <option value={10}>10条/页</option>
                  <option value={20}>20条/页</option>
                  <option value={50}>50条/页</option>
                </select>
                <Pagination
                  page={swrState.page}
                  count={pager.count ? Math.ceil(pager.count / pager.limit) : 1}
                  variant="outlined"
                  shape="rounded"
                  onChange={(event, page) => {
                    handlePaginationChange(page, "page")
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {drawerOpen && (
        <AddOrEditProject
          editItem={editItem}
          open={drawerOpen}
          close={handleCloseProjectWithDrawer}
          getDataList={getProjectDataList}
          type={type}
        />
      )}
    </>
  )
}
