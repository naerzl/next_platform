"use client"
import * as React from "react"
import { GridSortModel } from "@mui/x-data-grid"
import { GetDictionaryDataOption } from "./Main"
import { DictionaryData } from "../types"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import useSWRMutation from "swr/mutation"
import { reqDeleteDictionary, reqPutDictionary } from "../api"
import SideContext from "../context/sideContext"
import { message } from "antd"
import Empty from "@/components/Empty"
import useHooksConfirm from "@/hooks/useHooksConfirm"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import { IconButton, MenuItem, Tooltip } from "@mui/material"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"

// 排序方式（正序倒序）
type Order = "asc" | "desc"

interface Props {
  tableData: DictionaryData[]
  // eslint-disable-next-line no-unused-vars
  getDictionaryData: (option: GetDictionaryDataOption) => void
  // eslint-disable-next-line no-unused-vars
  handleSortTable: (order: Order) => void
  // eslint-disable-next-line no-unused-vars
  handleEditDictionart: (id: number) => void
}

export default function dataTable(props: Props) {
  const { tableData, getDictionaryData, handleSortTable, handleEditDictionart } = props

  const { trigger: deleteDictionaryApi } = useSWRMutation("/dictionary", reqDeleteDictionary)

  const ctx = React.useContext(SideContext)

  const { handleConfirm } = useHooksConfirm()

  if (tableData.length <= 0) {
    return (
      <Empty
        className="w-full h-full flex flex-col justify-center items-center"
        fontSize="5rem"
        color="#dce0e6"
        text={<div>暂时还没有数据</div>}
      />
    )
  }

  const handleClickDictionary = (id: number) => {
    handleConfirm(() => {
      deleteDictionaryApi({ id }).then(() => {
        message.success("删除成功")
        getDictionaryData({ class_id: ctx.currentClassId })
      })
    })
  }

  const columns = [
    {
      title: "字典名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "排序",
      dataIndex: "sort",
      key: "sort",
    },

    {
      width: "150px",
      title: "操作",
      key: "action",
    },
  ]

  const handleSortChange = ([model]: GridSortModel) => {
    handleSortTable(model.sort as Order)
  }

  return (
    <div style={{ width: "100%" }}>
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
          {tableData?.map((row) => (
            <TableRow key={row.code} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell align="left">{row.name}</TableCell>
              <TableCell align="left">{row.serial}</TableCell>
              <TableCell align="left">
                <div className="flex justify-start g">
                  <Tooltip title="修改字典">
                    <IconButton
                      onClick={() => {
                        handleEditDictionart(row.id)
                      }}>
                      <EditOutlinedIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="删除字典">
                    <IconButton
                      onClick={() => {
                        handleClickDictionary(row.id)
                      }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
