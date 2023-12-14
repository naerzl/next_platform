import { Button, Divider, Drawer } from "@mui/material"
import React from "react"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import { ProcessListData, TypeEBSDataList } from "@/app/ebs-profession/ebs-data/types"
import { reqDelProcess, reqPutEBS } from "@/app/ebs-profession/ebs-data/api"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import useDrawerAddProcess from "@/app/ebs-profession/ebs-data/hooks/useDrawerAddProcess"
import RunCircleOutlinedIcon from "@mui/icons-material/RunCircleOutlined"
import useSWRMutation from "swr/mutation"
import useDialogProcessForm from "@/app/ebs-profession/ebs-data/hooks/useDialogProcessForm"
import DialogProcessForm from "@/app/ebs-profession/ebs-data/components/DialogProcessForm"
import { useConfirmationDialog } from "@/components/ConfirmationDialogProvider"
import { displayWithPermission } from "@/libs/methods"
import permissionJson from "@/config/permission.json"
import { LayoutContext } from "@/components/LayoutContext"
import DialogApplyProcess from "@/app/ebs-profession/ebs-data/components/DialogApplyProcess"
import { reqGetProcess, reqGetTagsList } from "@/app/process-list/api"
import {
  ProcessListDataType,
  TagsListDataType,
  TypeApiGetProcessParams,
} from "@/app/process-list/types"

type Props = {
  open: boolean
  handleCloseDrawerProcess: () => void
  item: TypeEBSDataList
  handleOpenDrawerProcess: (item: TypeEBSDataList) => void
}

const stageEnum = [
  {
    label: "开始",
    value: 1,
  },
  {
    label: "",
    value: 2,
  },
  {
    label: "结束",
    value: 3,
  },
]

function renderProperty(str: string[] | null) {
  if (str) {
    return str.join(",")
  }
  return ""
}

const columns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    align: "left",
  },
  {
    title: "工序名称",
    dataIndex: "name",
    key: "name",
    align: "left",
  },

  {
    title: "标识",
    dataIndex: "identifying",
    key: "identifying",
    align: "left",
  },
  {
    align: "left",
    title: "说明",
    dataIndex: "desc",
    key: "desc",
  },

  {
    title: "操作",
    key: "action",
  },
]

export default function drawerProcessList(props: Props) {
  const { open, handleCloseDrawerProcess, item, handleOpenDrawerProcess } = props

  const { permissionTagList } = React.useContext(LayoutContext)

  const handleClose = () => {
    handleCloseDrawerProcess()
  }

  const [tableList, setTableList] = React.useState<ProcessListDataType[]>([])

  const { trigger: getProcessApi } = useSWRMutation("/process", reqGetProcess)

  const { trigger: getTagsListApi } = useSWRMutation("/tag", reqGetTagsList)

  const getProcessListData = async (tags?: string[]) => {
    debugger
    let tagsArr = JSON.parse(item.tags)

    let params = {
      tags: tags
        ? JSON.stringify(tags)
        : tagsArr.length > 0
        ? JSON.stringify([tagsArr[tagsArr.length - 1]])
        : JSON.stringify([""]),
    } as TypeApiGetProcessParams

    if (!tags && item.tags && JSON.parse(item.tags).length <= 0) {
      return
    }
    const res = await getProcessApi(params)
    setTableList(res || [])
  }

  const [tagsList, setTagsList] = React.useState<TagsListDataType[]>([])

  const getTagsListData = async () => {
    const res = await getTagsListApi({})
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
    getTagsListData()
    getProcessListData()
  }, [])

  const { handleCloseDrawerAddProcess, handleOpenDrawerAddProcess, dialogApplyProcessOpen } =
    useDrawerAddProcess()

  const { handleOpenDialogAddForm, handleCloseDialogAddForm, dialogAddFormOpen, formItem } =
    useDialogProcessForm()

  const handleAppleCallBack = (processList: ProcessListDataType[], tags: string[]) => {
    console.log(tags)
    handleOpenDrawerProcess({ ...item, tags: JSON.stringify(tags) })
    getProcessListData(tags)
  }

  return (
    <>
      <Drawer open={open} onClose={handleClose} anchor="right" sx={{ zIndex: 1600 }}>
        <div className="w-[80vw] p-10">
          <header className="text-3xl text-[#44566C] mb-8">
            <div>节点名称：{item.name}</div>
            <Divider sx={{ my: 1.5 }} />
            <div className="flex justify-start gap-x-2">
              <Button
                sx={
                  JSON.parse(item.tags).length > 0
                    ? {
                        color: "rgba(0, 0, 0, 0.26) !important",
                        bgcolor: "rgba(0, 0, 0, 0.12) !important",
                      }
                    : {}
                }
                style={displayWithPermission(
                  permissionTagList,
                  permissionJson.ebs_specialty_list_process_member_write,
                )}
                disabled={JSON.parse(item.tags).length > 0}
                variant="contained"
                className="bg-railway_blue"
                startIcon={<AddOutlinedIcon />}
                onClick={() => {
                  handleOpenDrawerAddProcess()
                }}>
                关联工序
              </Button>
              {/*<Button*/}
              {/*  style={displayWithPermission(*/}
              {/*    permissionTagList,*/}
              {/*    permissionJson.ebs_specialty_list_process_member_write,*/}
              {/*  )}*/}
              {/*  variant="outlined"*/}
              {/*  color="error"*/}
              {/*  startIcon={<AddOutlinedIcon />}*/}
              {/*  onClick={() => {}}>*/}
              {/*  停用工序*/}
              {/*</Button>*/}
            </div>
          </header>
          <div style={{ width: "100%", height: "100%", paddingBottom: "38px" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col.key} sx={{ width: col.key == "action" ? "200px" : "auto" }}>
                      {col.title}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableList &&
                  tableList.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.serial}
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{findTagsName(row.tags)}</TableCell>
                      <TableCell align="left">{row.desc}</TableCell>
                      <TableCell align="left">
                        <div className="flex justify-between items-center">
                          <Button
                            variant="outlined"
                            startIcon={<RunCircleOutlinedIcon />}
                            color="success"
                            onClick={() => {
                              handleOpenDialogAddForm(row)
                            }}>
                            工序表单
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Drawer>

      {dialogAddFormOpen && (
        <DialogProcessForm
          open={dialogAddFormOpen}
          handleCloseDialogAddForm={handleCloseDialogAddForm}
          item={formItem}
        />
      )}
      {dialogApplyProcessOpen && (
        <DialogApplyProcess
          open={dialogApplyProcessOpen}
          handleCloseDialogAddForm={handleCloseDrawerAddProcess}
          item={item}
          cb={handleAppleCallBack}
        />
      )}
    </>
  )
}
