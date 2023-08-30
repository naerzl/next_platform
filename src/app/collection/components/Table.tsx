"use client"
import * as React from "react"
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from "@mui/x-data-grid"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import EditIcon from "@mui/icons-material/Edit"
import useSWRMutation from "swr/mutation"
import { message } from "antd"
import { checkObjectEquality } from "@/libs/methods"
import { ReqGetAddCollectionResponse } from "../types"
import { reqDelCollection, reqPutEditCollection } from "../api"
import { useRouter } from "next/navigation"
import Empty from "@/components/Empty"

interface Props {
  tableData: ReqGetAddCollectionResponse[]
  getCollectionData: () => void
}

export default function Table(props: Props) {
  const { tableData, getCollectionData } = props
  const router = useRouter()

  const { trigger: putEditCollectionApi } = useSWRMutation(
    "/structure-collection",
    reqPutEditCollection,
  )
  // 处理行修改
  const hanldeRowDataUpdate = async (
    newData: ReqGetAddCollectionResponse,
    oldData: ReqGetAddCollectionResponse,
  ) => {
    if (checkObjectEquality(newData, oldData)) return newData
    await putEditCollectionApi(newData)
    message.success("操作成功")
    return newData
  }

  const { trigger: delCollectionApi } = useSWRMutation("/structure-collection", reqDelCollection)

  const handleDeleteClick = async (id: GridRowId) => {
    await delCollectionApi({ id: id as number })
    message.success("删除成功")
    getCollectionData()
  }

  const handleEditClick = (id: GridRowId) => {
    router.push(
      `/collection/detail?collection_id=${id}&name=${tableData.find((item) => item.id == id)
        ?.name}`,
    )
  }

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "表结构名称",
      align: "center",
      headerAlign: "center",
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
    },

    {
      field: "actions",
      type: "actions",
      headerName: "操作",
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key={id}
            icon={<EditIcon />}
            label="edit"
            onClick={() => handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(id)}
            color="inherit"
          />,
        ]
      },
    },
  ]

  return (
    <div
      className="w-full flex flex-col"
      style={
        tableData.length > 0
          ? { maxWidth: "75vw", height: "calc(100% - 3rem)" }
          : { justifyContent: "center", height: "calc(100% - 3rem)" }
      }>
      {tableData.length > 0 ? (
        <DataGrid
          sortingOrder={["asc", "desc"]}
          rows={tableData}
          editMode="row"
          showColumnVerticalBorder
          showCellVerticalBorder
          columns={columns}
          processRowUpdate={hanldeRowDataUpdate}
        />
      ) : (
        <Empty
          className="w-full h-full flex flex-col justify-center items-center"
          fontSize="5rem"
        />
      )}
    </div>
  )
}
