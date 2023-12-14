import React from "react"
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import { reqDelProcess, reqGetProcessForm } from "@/app/ebs-profession/ebs-data/api"
import useSWRMutation from "swr/mutation"
import { ProcessFormListData, ProcessRoleData } from "@/app/ebs-profession/ebs-data/types"
import useDrawerAddProcessForm from "@/app/ebs-profession/ebs-data/hooks/useDrawerAddProcessForm"
import DrawerAddForm from "@/app/process-list/components/DrawerAddForm"
import { useConfirmationDialog } from "@/components/ConfirmationDialogProvider"
import { DATUM_CLASS } from "@/app/ebs-profession/ebs-data/const"
import { displayWithPermission } from "@/libs/methods"
import permissionJson from "@/config/permission.json"
import { LayoutContext } from "@/components/LayoutContext"
import { ProcessFormListDataType, ProcessListDataType } from "@/app/process-list/types"

type Props = {
  open: boolean
  handleCloseDialogAddForm: () => void
  item: ProcessListDataType
}

const stageEnum = [
  {
    label: "开始",
    value: 1,
  },
  {
    label: "结束",
    value: 3,
  },
]

function renderTableCellStage(item: ProcessListDataType) {
  return stageEnum.find((el) => el.value == +item.stage)?.label
}

const columns = [
  {
    title: "表单名称",
    dataIndex: "name",
    key: "name",
    align: "left",
  },
  {
    title: "工序类型",
    dataIndex: "type",
    key: "type",
    align: "left",
  },
  {
    title: "角色",
    dataIndex: "duration",
    key: "duration",
    align: "left",
  },
  {
    title: "是否循环工序",
    dataIndex: "identifying",
    key: "identifying",
    align: "left",
  },
  {
    title: "表单说明",
    dataIndex: "shuoming",
    key: "shuoming",
    align: "left",
  },

  {
    width: "150px",
    title: "操作",
    key: "action",
  },
]

const renderTableCellRole = (arr: ProcessRoleData[]) => {
  return arr?.map((item) => item.flag_name).join(",")
}

export default function DialogProcessForm(props: Props) {
  const { open, handleCloseDialogAddForm, item } = props

  const { permissionTagList } = React.useContext(LayoutContext)

  const { trigger: delProcessFormApi } = useSWRMutation("/process-form", reqDelProcess)
  const { trigger: getProcessFormApi } = useSWRMutation("/process-form", reqGetProcessForm)

  const [tableList, setTableList] = React.useState<ProcessFormListData[]>([])

  const getProcessFormListData = async () => {
    const res = await getProcessFormApi({ process_id: +item.id })
    setTableList(res || [])
  }

  React.useEffect(() => {
    getProcessFormListData()
  }, [])

  const handleEditeProcessWithDrawer = (item: ProcessFormListData) => {
    handleEditeProcessFormWithDrawer(item)
  }

  const { showConfirmationDialog: handleConfirm } = useConfirmationDialog()

  const handleDelProcessFormWithSWR = (id: number) => {
    handleConfirm("你确定要删除吗？", async () => {
      await delProcessFormApi({ id })
      getProcessFormListData()
    })
  }

  const {
    handleOpenDrawerAddForm,
    handleCloseDrawerAddForm,
    drawerAddFormOpen,
    formItem,
    handleEditeProcessFormWithDrawer,
  } = useDrawerAddProcessForm()

  const handleAddOrEditProcessFormCallBack = async (
    item: ProcessFormListDataType,
    isAdd: boolean,
  ) => {
    getProcessFormListData()
  }

  return (
    <>
      <Dialog
        onClose={handleCloseDialogAddForm}
        open={open}
        sx={{ zIndex: 1700, ".MuiPaper-root": { maxWidth: "none" } }}>
        <DialogTitle>工序名称:{item.name}</DialogTitle>
        <DialogContent sx={{ width: "80vw", height: "80vh" }}>
          <div>
            <header>
              <Button
                style={displayWithPermission(
                  permissionTagList,
                  permissionJson.ebs_specialty_list_process_member_write,
                )}
                variant="contained"
                className="bg-railway_blue"
                onClick={() => {
                  handleOpenDrawerAddForm()
                }}>
                新建表单
              </Button>
            </header>
            <Table sx={{ minWidth: "70vw" }} aria-label="simple table" stickyHeader>
              <TableHead>
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
                  tableList.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">
                        {DATUM_CLASS.find((item) => item.value == row.datum_class)?.label}
                      </TableCell>
                      <TableCell align="left">{renderTableCellRole(row.roles)}</TableCell>
                      <TableCell align="left">
                        {row.class == "ordinary" ? "普通任务" : "持续性任务"}
                      </TableCell>
                      <TableCell align="left">{row.desc}</TableCell>
                      <TableCell align="left">
                        <div className="flex justify-start">
                          <IconButton
                            style={displayWithPermission(
                              permissionTagList,
                              permissionJson.ebs_specialty_list_process_member_update,
                            )}
                            onClick={() => {
                              handleEditeProcessWithDrawer(row)
                            }}>
                            <EditOutlinedIcon />
                          </IconButton>
                          <IconButton
                            style={displayWithPermission(
                              permissionTagList,
                              permissionJson.ebs_specialty_list_process_member_delete,
                            )}
                            onClick={() => {
                              handleDelProcessFormWithSWR(row.id)
                            }}>
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
      {drawerAddFormOpen && (
        <DrawerAddForm
          open={drawerAddFormOpen}
          editItem={formItem}
          handleCloseDrawerAddForm={handleCloseDrawerAddForm}
          cb={handleAddOrEditProcessFormCallBack}
          processItem={item}
        />
      )}
    </>
  )
}
