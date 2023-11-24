import { Button, Divider, Drawer } from "@mui/material"
import React from "react"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import { ProcessListData, TypeEBSDataList } from "@/app/ebs-profession/ebs-data/types"
import useSWR from "swr"
import { reqDelProcess, reqGetProcess } from "@/app/ebs-profession/ebs-data/api"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import useDrawerAddProcess from "@/app/ebs-profession/ebs-data/hooks/useDrawerAddProcess"
import AddProcess from "@/app/ebs-profession/ebs-data/components/AddProcess"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import RunCircleOutlinedIcon from "@mui/icons-material/RunCircleOutlined"
import useSWRMutation from "swr/mutation"
import useDialogProcessForm from "@/app/ebs-profession/ebs-data/hooks/useDialogProcessForm"
import DialogProcessForm from "@/app/ebs-profession/ebs-data/components/DialogProcessForm"
import { useConfirmationDialog } from "@/components/ConfirmationDialogProvider"
import { displayWithPermission } from "@/libs/methods"
import permissionJson from "@/config/permission.json"
import { LayoutContext } from "@/components/LayoutContext"

type Props = {
  open: boolean
  handleCloseDrawerProcess: () => void
  item: TypeEBSDataList
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

function renderTableCellStage(item: ProcessListData) {
  return stageEnum.find((el) => el.value == +item.stage)?.label
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
    title: "工作量%",
    dataIndex: "duration",
    key: "duration",
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
  const { open, handleCloseDrawerProcess, item } = props

  const { showConfirmationDialog: handleConfirm } = useConfirmationDialog()

  const { permissionTagList } = React.useContext(LayoutContext)

  const handleClose = () => {
    handleCloseDrawerProcess()
  }

  const [tableList, setTableList] = React.useState<ProcessListData[]>([])

  const { trigger: getProcessApi } = useSWRMutation("/process", reqGetProcess)

  const { trigger: delProcessApi } = useSWRMutation("/process", reqDelProcess)

  const getProcessListData = async () => {
    const res = await getProcessApi({ ebs_id: item.id })
    setTableList(res || [])
  }

  React.useEffect(() => {
    getProcessListData()
  }, [])

  const {
    handleCloseDrawerAddProcess,
    handleOpenDrawerAddProcess,
    drawerAddProcessOpen,
    editItem,
    handleEditeProcessWithDrawer,
  } = useDrawerAddProcess()

  const addProcessCallBack = async (item: ProcessListData, isAdd: boolean) => {
    const newData = structuredClone(tableList)
    console.log(item)
    if (isAdd) {
      newData?.push(item)
    } else {
      const index = newData?.findIndex((row) => row.id == item.id) as number
      newData![index] = item
    }

    getProcessListData()
  }

  const handleDelProcessWithSWR = (id: number) => {
    handleConfirm("你确定要删除吗？", async () => {
      //   拷贝数据
      await delProcessApi({ id })
      const newData = tableList?.filter((item) => item.id !== id)
      getProcessListData()
    })
  }

  const { handleOpenDialogAddForm, handleCloseDialogAddForm, dialogAddFormOpen, formItem } =
    useDialogProcessForm()

  return (
    <>
      <Drawer open={open} onClose={handleClose} anchor="right" sx={{ zIndex: 1600 }}>
        <div className="w-[80vw] p-10">
          <header className="text-3xl text-[#44566C] mb-8">
            <div>节点名称：{item.name}</div>
            <Divider sx={{ my: 1.5 }} />
            <div className="flex justify-end">
              <Button
                style={displayWithPermission(
                  permissionTagList,
                  permissionJson.ebs_specialty_list_process_member_write,
                )}
                variant="contained"
                className="bg-railway_blue"
                startIcon={<AddOutlinedIcon />}
                onClick={() => {
                  handleOpenDrawerAddProcess()
                }}>
                新建工序
              </Button>
            </div>
          </header>
          <div style={{ width: "100%", height: "100%", paddingBottom: "38px" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col.key} sx={{ width: col.key == "action" ? "336px" : "auto" }}>
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
                        {index + 1}
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.percentage}</TableCell>
                      <TableCell align="left">{renderTableCellStage(row)}</TableCell>
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
                          <Button
                            style={displayWithPermission(
                              permissionTagList,
                              permissionJson.ebs_specialty_list_process_member_update,
                            )}
                            variant="outlined"
                            startIcon={<EditOutlinedIcon />}
                            onClick={() => {
                              handleEditeProcessWithDrawer(row)
                            }}>
                            编辑
                          </Button>
                          <Button
                            style={displayWithPermission(
                              permissionTagList,
                              permissionJson.ebs_specialty_list_process_member_delete,
                            )}
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            color="error"
                            onClick={() => {
                              handleDelProcessWithSWR(row.id)
                            }}>
                            删除
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
      {drawerAddProcessOpen && (
        <AddProcess
          open={drawerAddProcessOpen}
          item={item}
          editItem={editItem}
          handleCloseDrawerAddProcess={handleCloseDrawerAddProcess}
          cb={addProcessCallBack}
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
