"use client"
import React from "react"
import SideBar from "./components/SideBar"
import DataTable from "./components/DataTable"
import { Button, IconButton, InputAdornment, InputBase } from "@mui/material"
import AddDidlog from "./components/AddDidlog"
import SearchIcon from "@mui/icons-material/Search"
import { STATUS_SUCCESS } from "@/libs/const"
import useSWRMutation from "swr/mutation"
import { DictionaryClassData, DictionaryData, ReqGetDictionaryParams } from "./types"
import { reqGetDictionary, reqGetDictionaryClass } from "./api"
import SideContext from "./context/sideContext"

// 获取字典列表数据函数的参数类型
export interface GetDictionaryDataOption {
  order_by?: "desc" | "asc"
  class_id?: number
}

function Dictionary() {
  // 控制添加字典dialog显示隐藏
  const [params, setParams] = React.useState<ReqGetDictionaryParams>({
    limit: 20,
    page: 1,
    order: "serial",
    order_by: "desc",
    class_id: 1,
  })
  // 当前侧边栏的id
  const [currentClassId, setCurrentClassId] = React.useState(1)
  const changeCurrentClassId = (currentId: number) => {
    setCurrentClassId(currentId)
  }
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const { trigger: getDictionaryApi } = useSWRMutation("/dictionary", reqGetDictionary)
  const { trigger: getDictionaryClassApi } = useSWRMutation(
    "/dictionary-class",
    reqGetDictionaryClass,
  )
  const [sideBarList, setSideBarList] = React.useState<DictionaryClassData[]>([])
  // 表格数据
  const [tableData, setTableData] = React.useState<DictionaryData[]>([])

  const getDictionaryClassData = React.useCallback(async () => {
    // 获取字典分类
    const res = await getDictionaryClassApi({ page: 1, limit: 15 })
    if (res.code !== STATUS_SUCCESS) return
    setSideBarList(res.data.items)
  }, [])

  // 获取字典数据
  const getDictionaryData = React.useCallback(async (option?: GetDictionaryDataOption) => {
    setParams((pre) => ({
      ...pre,
      order_by: option?.order_by || pre.order_by,
      class_id: option?.class_id || pre.class_id,
    }))
    // 获取字典数据
    getDictionaryApi({
      ...params,
      order_by: option?.order_by || params.order_by,
      class_id: option?.class_id || params.class_id,
    }).then((res) => {
      if (res.code !== STATUS_SUCCESS) return
      setTableData(res.data.items)
    })
  }, [])
  React.useEffect(() => {
    getDictionaryClassData().then(() => {
      if (sideBarList.length == 0) return
      getDictionaryData({ class_id: sideBarList[0].id })
    })
  }, [getDictionaryData, getDictionaryClassData])

  // dialog打开
  const handleClickOpen = () => {
    setOpen(true)
  }
  // dialog关闭
  const handleClose = () => {
    setOpen(false)
  }

  // 字典模糊搜索
  const handleClickSearch = () => {
    getDictionaryApi({ ...params, name: search }).then((res) => {
      if (res.code !== STATUS_SUCCESS) return
      setTableData(res.data.items)
    })
  }

  // 处理表格切换排序
  const handleSortTable = (order: "asc" | "desc") => {
    getDictionaryApi({ ...params, order_by: order, name: search }).then((res) => {
      if (res.code !== STATUS_SUCCESS) return
      setTableData(res.data.items)
    })
  }

  return (
    <SideContext.Provider
      value={{
        sideBarList,
        changeSideBarList: getDictionaryClassData,
        currentClassId,
        changeCurrentClassId,
      }}>
      <div className="h-full flex">
        {/* 左侧导航 */}
        <aside className="w-60 h-full  mr-3 bg-white">
          <SideBar getDictionaryData={getDictionaryData} />
        </aside>
        <div className="flex-1 flex flex-col  gap-y-2">
          {/* 头部搜索 */}
          <header className="h-12 flex items-center ">
            <Button variant="outlined" onClick={handleClickOpen}>
              新增字典
            </Button>
            <InputBase
              className="w-72 bg-[#f8fafb] border rounded-md px-2 mx-3"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    edge="end"
                    sx={{ p: "10px" }}
                    aria-label="search"
                    disableRipple
                    onClick={handleClickSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </header>
          {/* 表格主体 */}
          <div className="flex-1 border">
            <DataTable
              tableData={tableData}
              getDictionaryData={getDictionaryData}
              handleSortTable={handleSortTable}
            />
          </div>
        </div>
        <AddDidlog
          open={open}
          close={handleClose}
          getDictionaryData={getDictionaryData}
          class_id={currentClassId}
        />
      </div>
    </SideContext.Provider>
  )
}

export default Dictionary
