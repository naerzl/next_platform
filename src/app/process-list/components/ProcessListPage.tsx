"use client"
import React from "react"
import { Breadcrumbs, Button, Chip, InputBase, Pagination } from "@mui/material"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import Table from "@mui/material/Table"
import Loading from "@/components/loading"
import useSWRMutation from "swr/mutation"
import permissionJson from "@/config/permission.json"
import NoPermission from "@/components/NoPermission"
import { LayoutContext } from "@/components/LayoutContext"
import { reqGetProcess, reqGetTagsList } from "@/app/process-list/api"
import {
  ProcessListDataType,
  TagsListDataType,
  TypeApiGetProcessParams,
} from "@/app/process-list/types"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import useDrawerProcess from "@/app/process-list/hooks/useDrawerProcess"
import AddOrEditProcess from "@/app/process-list/components/AddOrEditProcess"
import { ProcessListData } from "@/app/ebs-profession/ebs-data/types"
import useDialogProcessForm from "@/app/process-list/hooks/useDialogProcessForm"
import DialogProcessForm from "@/app/process-list/components/DialogProcessForm"

const columns = [
  {
    title: "序号",
    key: "id",
  },
  {
    title: "工序名称",
    key: "name",
  },
  {
    title: "工序标签",
    key: "ebs_name",
  },
  {
    title: "说明",
    key: "class",
  },

  {
    title: "操作",
    key: "action",
  },
]

export default function ProcessListPage() {
  const { permissionTagList } = React.useContext(LayoutContext)

  const {
    drawerProcessOpen,
    editItem,
    handleEditDrawerProcess,
    handleCloseDrawerProcess,
    handleAddDrawerProcess,
  } = useDrawerProcess()

  const { handleOpenDialogAddForm, handleCloseDialogAddForm, dialogAddFormOpen, formItem } =
    useDialogProcessForm()

  const [searchState, setSearchState] = React.useState<TypeApiGetProcessParams>(
    {} as TypeApiGetProcessParams,
  )

  const [processList, setProcessList] = React.useState<ProcessListDataType[]>([])

  const { trigger: getProcessApi, isMutating } = useSWRMutation("/process", reqGetProcess)

  const { trigger: getTagsApi } = useSWRMutation("/tag", reqGetTagsList)

  const getProcessListData = async () => {
    const res = await getProcessApi({})
    if (res) {
      setProcessList(res.sort((a, b) => a.serial - b.serial))
    }
  }

  const [tagsList, setTagsList] = React.useState<TagsListDataType[]>([])

  const getTagsList = async () => {
    const res = await getTagsApi({})
    setTagsList(res)
  }

  function findTagsName(tags: string[] | null) {
    if (tagsList.length <= 0 || !tags) return ""

    return tags
      .map((tag) => {
        const item = tagsList.find((item) => item.flag == tag)
        return item ? item.name : ""
      })
      .join(",")
  }

  React.useEffect(() => {
    getTagsList()
    getProcessListData()
  }, [])

  const handleSearchChangeState = async (key: keyof TypeApiGetProcessParams, value: string) => {
    if (value == "") {
      let params = structuredClone(searchState)
      delete params[key]
      setSearchState(params)
      return
    }
    setSearchState((prevState) => ({
      ...prevState,
      [key]: key == "tags" ? JSON.stringify([value]) : value,
    }))
  }

  const handleSearch = async () => {
    const res = await getProcessApi(searchState)
    setProcessList(res ?? [])
  }

  const handleAddOrEditFormCb = (item: ProcessListDataType, isAdd: boolean) => {
    getProcessListData()
    getTagsList()
  }

  if (!permissionTagList.includes(permissionJson.list_of_engineering_majors_member_read)) {
    return <NoPermission />
  }

  return (
    <>
      <h3 className="font-bold text-[1.875rem]">工序设置</h3>
      <div className="mb-9 mt-7">
        <Breadcrumbs aria-label="breadcrumb" separator=">">
          <Link underline="hover" color="inherit" href="/dashboard">
            <i className="iconfont icon-homefill" style={{ fontSize: "14px" }}></i>
          </Link>
          <Typography color="text.primary" sx={{ fontSize: "14px" }}>
            工序设置
          </Typography>
        </Breadcrumbs>
      </div>
      <header className="flex justify-between mb-4">
        <div className="flex gap-x-2">
          <InputBase
            className="w-[12rem] h-10 border  px-2 shadow bg-white"
            placeholder="请输入工序名称"
            onChange={(event) => {
              handleSearchChangeState("name", event.target.value)
            }}
          />

          <InputBase
            className="w-[12rem] h-10 border  px-2 shadow bg-white"
            placeholder="请输入标签"
            onChange={(event) => {
              handleSearchChangeState("tags", event.target.value)
            }}
          />
          <Button
            className="bg-railway_blue text-white"
            onClick={() => {
              handleSearch()
            }}>
            搜索
          </Button>
        </div>
        <div>
          <Button
            className="bg-railway_blue text-white"
            onClick={() => {
              handleAddDrawerProcess()
            }}>
            添加工序
          </Button>
        </div>
      </header>
      {isMutating ? (
        <Loading />
      ) : (
        <div className="flex-1 bg-white overflow-hidden">
          <div className="h-full relative border">
            <div
              className="custom-scroll-bar shadow-sm overflow-y-auto "
              style={{ height: "calc(100% - 32px)" }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
                <TableHead sx={{ position: "sticky", top: "0", zIndex: 5 }}>
                  <TableRow>
                    {columns.map((col, index) => (
                      <TableCell key={index} sx={{ width: col.key == "action" ? "250px" : "auto" }}>
                        {col.title}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processList.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.serial}
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{findTagsName(row.tags)}</TableCell>
                      <TableCell align="left">{row.desc}</TableCell>
                      <TableCell align="left">
                        <div className="flex gap-x-2">
                          <Button
                            variant="outlined"
                            color="success"
                            onClick={() => {
                              handleOpenDialogAddForm(row)
                            }}
                            startIcon={<i className="iconfont icon-shigong"></i>}>
                            工序表单
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              handleEditDrawerProcess(row)
                            }}
                            startIcon={<EditOutlinedIcon />}>
                            编辑
                          </Button>
                          {/*<Button*/}
                          {/*  variant="outlined"*/}
                          {/*  color="error"*/}
                          {/*  onClick={() => {}}*/}
                          {/*  startIcon={<DeleteOutlineIcon />}>*/}
                          {/*  弃用*/}
                          {/*</Button>*/}
                          {/*<Button*/}
                          {/*  variant="outlined"*/}
                          {/*  onClick={() => {}}*/}
                          {/*  startIcon={<EditOutlinedIcon />}>*/}
                          {/*  启用*/}
                          {/*</Button>*/}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
      {drawerProcessOpen && (
        <AddOrEditProcess
          editItem={editItem}
          open={drawerProcessOpen}
          handleCloseDrawerAddProcess={handleCloseDrawerProcess}
          cb={handleAddOrEditFormCb}
        />
      )}
      {dialogAddFormOpen && (
        <DialogProcessForm
          open={dialogAddFormOpen}
          handleCloseDialogAddForm={handleCloseDialogAddForm}
          item={formItem}
        />
      )}
    </>
  )
}
