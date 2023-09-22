import React from "react"
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import useSWR from "swr"
import { reqDelProcess, reqGetProcess, reqGetProcessForm } from "@/app/ebs-profession/ebs-data/api"
import useSWRMutation from "swr/mutation"
import {
  ProcessFormListData,
  ProcessListData,
  ProcessRoleData,
} from "@/app/ebs-profession/ebs-data/types"
import useDrawerAddProcessForm from "@/app/ebs-profession/ebs-data/hooks/useDrawerAddProcessForm"
import DrawerAddForm from "@/app/ebs-profession/ebs-data/components/DrawerAddForm"

type Props = {
  open: boolean
  handleCloseDialogAddForm: () => void
  item: ProcessListData
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
    title: "表单名称",
    dataIndex: "name",
    key: "name",
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
    width: "150px",
    title: "操作",
    key: "action",
  },
]

const renderTableCellRole = (arr: ProcessRoleData[]) => {
  return arr.map((item) => item.flag_name).join(",")
}

export default function DialogProcessForm(props: Props) {
  const { open, handleCloseDialogAddForm, item } = props

  const { data: tableList, mutate: mutateTableList } = useSWR(
    () => (item.id ? `/process-form?process_id =${item.id}` : null),
    (url: string) => reqGetProcessForm(url, { arg: { process_id: +item.id } }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  const { trigger: delProcessFormApi } = useSWRMutation("/process-form", reqDelProcess)

  const handleEditeProcessWithDrawer = (item: ProcessFormListData) => {
    handleEditeProcessFormWithDrawer(item)
  }

  const handleDelProcessFormWithSWR = async (id: number) => {
    await delProcessFormApi({ id })
    await mutateTableList(tableList?.filter((item) => item.id != id), false)
  }

  const {
    handleOpenDrawerAddForm,
    handleCloseDrawerAddForm,
    drawerAddFormOpen,
    formItem,
    handleEditeProcessFormWithDrawer,
  } = useDrawerAddProcessForm()

  const handleAddOrEditProcessFormCallBack = async (item: ProcessFormListData, isAdd: boolean) => {
    const newList = structuredClone(tableList)
    if (isAdd) {
      newList?.push(item)
    } else {
      const index = newList?.findIndex((item) => item.id == item.id)
      newList![index!] = item
    }
    await mutateTableList(newList, false)
  }

  return (
    <>
      <Dialog
        onClose={handleCloseDialogAddForm}
        open={open}
        sx={{ zIndex: 1700 }}
        className="custom">
        <DialogTitle>工序名称:{item.name}</DialogTitle>
        <div className="px-6">
          <span className="mr-3">工作量：{item.percentage}%</span>
          <span>标识：{renderTableCellStage(item)}</span>
        </div>
        <DialogContent sx={{ width: "80vw", height: "80vh" }}>
          <div>
            <header>
              <Button
                variant="contained"
                className="bg-railway_blue"
                onClick={() => {
                  handleOpenDrawerAddForm()
                }}>
                新建表单
              </Button>
            </header>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
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
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{renderTableCellRole(row.roles)}</TableCell>
                      <TableCell align="left">{row.desc}</TableCell>
                      <TableCell align="left">
                        <div className="flex justify-start">
                          <IconButton
                            onClick={() => {
                              handleEditeProcessWithDrawer(row)
                            }}>
                            <EditOutlinedIcon />
                          </IconButton>
                          <IconButton
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
