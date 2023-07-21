"use client"
import * as React from "react"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import Button from "@mui/material/Button"
import TableSortLabel from "@mui/material/TableSortLabel"
import useSWRMutation from "swr/mutation"
import InputBase from "@mui/material/InputBase"
import { reqDeleteDictionary, reqPutDictionary } from "../api"
import { DictionaryData } from "../types"
import message from "antd-message-react"
import { STATUS_SUCCESS } from "@/libs/const"
import { GetDictionaryDataOption } from "../page"
import SideContext from "../context/sideContext"

// 排序方式（正序倒序）
type Order = "asc" | "desc"

interface HeadCell {
  id?: keyof DictionaryData
  label: string
  numeric: boolean
}

// table头
const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    label: "项目名称",
  },
  {
    id: "serial",
    numeric: true,
    label: "排序",
  },
  {
    numeric: true,
    label: "操作",
  },
]

interface EnhancedTableProps {
  // eslint-disable-next-line no-unused-vars
  onRequestSort: (event: React.MouseEvent<unknown>) => void
  order: Order
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, onRequestSort } = props
  const createSortHandler = () => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell key={index} align="center" sortDirection={order} className="border">
            {headCell.id === "serial" ? (
              <TableSortLabel active={true} direction={order} onClick={createSortHandler()}>
                {headCell.label}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

interface Props {
  tableData: DictionaryData[]
  // eslint-disable-next-line no-unused-vars
  getDictionaryData: (option: GetDictionaryDataOption) => void
  // eslint-disable-next-line no-unused-vars
  handleSortTable: (order: Order) => void
}
export default function DataTable(props: Props) {
  const { tableData, getDictionaryData, handleSortTable } = props
  // 排序类型（正序倒序）
  const [order, setOrder] = React.useState<Order>("desc")

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(20)
  const ctx = React.useContext(SideContext)
  // swr发送请求

  const { trigger: deleteDictionaryApi } = useSWRMutation("/dictionary", reqDeleteDictionary)
  const { trigger: putDictionaryApi } = useSWRMutation("/dictionary", reqPutDictionary)

  // 切换排序方法
  const handleRequestSort = () => {
    const newOrder = order === "asc" ? "desc" : "asc"
    setOrder(newOrder)
    handleSortTable(newOrder)
  }
  // 修改分页页码变化
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  // 修改页数变化
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // 点击表格单元格设置变量控制input显示
  const [select, setSelect] = React.useState("")
  const handleClickTableCell = (type: keyof DictionaryData, row: DictionaryData) => {
    setSelect(`${type}-${row.id}`)
  }

  const handleInputBlur = (
    type: keyof DictionaryData,
    row: DictionaryData,
    e: React.FocusEvent<HTMLInputElement>,
  ) => {
    if (e.target.value === "") return setSelect("")
    putDictionaryApi({ ...row, [type]: e.target.value }).then((res) => {
      if (res.code !== STATUS_SUCCESS) return message.error(res.msg)
      message.success("修改成功")
      getDictionaryData({ order_by: order, class_id: ctx.currentClassId })
    })
    setSelect("")
  }

  // 删除字典万
  const handleClickDelete = (row: DictionaryData) => {
    deleteDictionaryApi(row.id).then((res) => {
      if (res.code !== STATUS_SUCCESS) return message.error("删除失败")
      message.success("删除成功")
      getDictionaryData({ order_by: order, class_id: ctx.currentClassId })
    })
  }
  return (
    <Box className="flex flex-col" sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      <TableContainer className="flex-1">
        <Table stickyHeader aria-labelledby="tableTitle">
          <EnhancedTableHead order={order} onRequestSort={handleRequestSort} />
          <TableBody>
            {tableData.map((row) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.id}
                  sx={{ cursor: "pointer" }}>
                  <TableCell
                    component="th"
                    scope="row"
                    align="center"
                    className="border text-center w-1/2"
                    onClick={() => handleClickTableCell("name", row)}>
                    {select == `name-${row.id}` ? (
                      <InputBase
                        className="border text-center"
                        autoFocus
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                          handleInputBlur("name", row, e)
                        }
                      />
                    ) : (
                      <p>{row.name}</p>
                    )}
                  </TableCell>
                  <TableCell
                    className="border"
                    align="center"
                    onClick={() => handleClickTableCell("serial", row)}>
                    {select == `serial-${row.id}` ? (
                      <InputBase
                        className="border text-center"
                        autoFocus
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                          handleInputBlur("serial", row, e)
                        }
                      />
                    ) : (
                      <p>{row.serial}</p>
                    )}
                  </TableCell>
                  <TableCell className="border w-8" align="center">
                    <Button variant="text" color="inherit" onClick={() => handleClickDelete(row)}>
                      删除
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        labelRowsPerPage="页码大小"
        className="h-13"
        rowsPerPageOptions={[10, 20]}
        component="div"
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  )
}
