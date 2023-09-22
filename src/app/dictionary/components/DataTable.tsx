"use client"
import * as React from "react"
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridSortModel,
} from "@mui/x-data-grid"
import { GetDictionaryDataOption } from "./Main"
import { DictionaryData } from "../types"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import useSWRMutation from "swr/mutation"
import { reqDeleteDictionary, reqPutDictionary } from "../api"
import SideContext from "../context/sideContext"
import { message } from "antd"
import { checkObjectEquality } from "@/libs/methods"
import Empty from "@/components/Empty"

// 排序方式（正序倒序）
type Order = "asc" | "desc"

interface Props {
  tableData: DictionaryData[]
  // eslint-disable-next-line no-unused-vars
  getDictionaryData: (option: GetDictionaryDataOption) => void
  // eslint-disable-next-line no-unused-vars
  handleSortTable: (order: Order) => void
}

export default function dataTable(props: Props) {
  const { tableData, getDictionaryData, handleSortTable } = props

  const { trigger: putDictionaryApi } = useSWRMutation("/dictionary", reqPutDictionary)
  const { trigger: deleteDictionaryApi } = useSWRMutation("/dictionary", reqDeleteDictionary)

  const ctx = React.useContext(SideContext)

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

  // 处理行修改
  const hanldeRowDataUpdate = (newData: any, oldData: any) => {
    if (checkObjectEquality(newData, oldData)) return newData
    putDictionaryApi(newData).then(() => {
      message.success("修改成功")
      getDictionaryData({ class_id: ctx.currentClassId })
    })
    return newData
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    deleteDictionaryApi({ id }).then(() => {
      message.success("删除成功")
      getDictionaryData({ class_id: ctx.currentClassId })
    })
  }

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "字典名称",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
      maxWidth: 630,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "serial",
      headerName: "排序",
      type: "number",
      editable: true,
      align: "center",
      headerAlign: "center",
      filterable: false,
      maxWidth: 630,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "操作",
      flex: 1,
      maxWidth: 130,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ]
      },
    },
  ]

  const handleSortChange = ([model]: GridSortModel) => {
    handleSortTable(model.sort as Order)
  }

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        sortingOrder={["asc", "desc"]}
        rows={tableData}
        editMode="row"
        initialState={{ pagination: { paginationModel: { pageSize: 15 } } }}
        showColumnVerticalBorder
        showCellVerticalBorder
        columns={columns}
        processRowUpdate={hanldeRowDataUpdate}
        onSortModelChange={handleSortChange}
        pageSizeOptions={[10, 15, 20]}
      />
    </div>
  )
}
