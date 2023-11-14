"use client"
import React from "react"
import SideBar from "../components/SideBar"
import DataTable from "../components/DataTable"
import { Breadcrumbs, Button, IconButton, InputAdornment, InputBase } from "@mui/material"
import AddDidlog from "../components/AddDidlog"
import SearchIcon from "@mui/icons-material/Search"
import useSWRMutation from "swr/mutation"
import useSWR from "swr"
import { DictionaryData, ReqGetDictionaryParams } from "../types"
import { reqGetDictionary, reqGetDictionaryClass } from "../api"
import SideContext from "../context/sideContext"
import { DICTIONARY_CLASS_LIMIT, DICTIONARY_LIMIT } from "../const"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import AddIcon from "@mui/icons-material/Add"
import { message } from "antd"

// 获取字典列表数据函数的参数类型
export interface GetDictionaryDataOption {
  order_by?: "desc" | "asc"
  class_id?: number
}

export default function dictionaryMain() {
  // 控制添加字典dialog显示隐藏
  const [params, setParams] = React.useState<ReqGetDictionaryParams>({
    limit: DICTIONARY_LIMIT,
    page: 1,
    order: "serial",
    order_by: "desc",
    class_id: 1,
  })
  // 当前侧边栏的id
  const [currentClassId, setCurrentClassId] = React.useState(0)
  const changeCurrentClassId = (currentId: number) => {
    setCurrentClassId(currentId)
  }

  const [open, setOpen] = React.useState(false)
  const [editItem, setEditItem] = React.useState<null | DictionaryData>(null)
  const [search, setSearch] = React.useState("")

  const { trigger: getDictionaryApi } = useSWRMutation("/dictionary", reqGetDictionary)
  const { trigger: getDictionaryClassApi } = useSWRMutation(
    "/dictionary-class",
    reqGetDictionaryClass,
  )
  const { data, isLoading, mutate } = useSWR(
    "/dictionary-class",
    (url: string) => reqGetDictionaryClass(url, { arg: {} }),
    { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false },
  )

  // 表格数据
  const [tableData, setTableData] = React.useState<DictionaryData[]>([])

  const getDictionaryClassData = React.useCallback(async () => {
    // 获取字典分类
  }, [])

  // 获取字典数据
  const getDictionaryData = React.useCallback(
    async (option?: GetDictionaryDataOption) => {
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
        setTableData(res.items)
      })
    },
    [currentClassId],
  )

  React.useEffect(() => {
    currentClassId > 0 && getDictionaryData({ class_id: currentClassId })
  }, [currentClassId])

  React.useEffect(() => {
    data && data.length > 0 && currentClassId <= 0 && setCurrentClassId(data[0].id)
  }, [data])

  // dialog打开
  const handleClickOpen = () => {
    setOpen(true)
  }
  // dialog关闭
  const handleClose = () => {
    setOpen(false)
    setEditItem(null)
  }

  // 字典模糊搜索
  const handleClickSearch = () => {
    getDictionaryApi({ ...params, name: search }).then((res) => {
      setTableData(res.items)
    })
  }

  // 处理表格切换排序
  const handleSortTable = (order: "asc" | "desc") => {
    getDictionaryApi({ ...params, order_by: order, name: search }).then((res) => {
      setTableData(res.items)
    })
  }

  const getSubClassList = async (id: number, indexStr: string) => {
    // 如果不传indexStr的话获取第一层级的
    if (indexStr == "") {
      const res = await getDictionaryClassApi({})
      mutate(res, false)
      return
    }
    const indexArr = indexStr.split("-")
    // 深拷贝数据
    const newArr = structuredClone(data)
    // eslint-disable-next-line no-unused-vars
    const res = await getDictionaryClassApi({
      parent_id: id,
    })
    const str = "newArr[" + indexArr?.join("].children[") + "].children"
    eval(str + "=res")
    mutate(newArr, false)
  }

  const handleEditDictionart = (id: number) => {
    const dictionary = tableData.find((item) => item.id == id)
    setEditItem(dictionary!)
    setOpen(true)
  }

  if (isLoading) {
    return <></>
  }

  return (
    <SideContext.Provider
      value={{
        sideBarList: data ? data : [],
        changeSideBarList: getDictionaryClassData,
        currentClassId,
        changeCurrentClassId,
        getSubClassList,
      }}>
      <h3 className="font-bold text-[1.875rem]">数据字典</h3>
      <div className="mb-9 mt-7">
        <Breadcrumbs aria-label="breadcrumb" separator=">">
          <Link underline="hover" color="inherit" href="/dashboard">
            <i className="iconfont icon-homefill" style={{ fontSize: "14px" }}></i>
          </Link>
          <Typography color="text.primary" sx={{ fontSize: "14px" }}>
            数据字典
          </Typography>
        </Breadcrumbs>
      </div>

      <div className="flex-1 flex-shrink-0 overflow-hidden bg-white border">
        <div className="h-full flex">
          {/* 左侧导航 */}
          <aside className="h-full  mr-3 bg-white border-r overflow-y-auto overflow-x-hidden">
            <SideBar />
          </aside>
          <div className="flex-1 flex flex-col  gap-y-2">
            {/* 头部搜索 */}
            <header className="h-12 flex items-center justify-between">
              <div>
                <Button
                  variant="outlined"
                  onClick={() => {
                    handleClickOpen()
                  }}
                  startIcon={<AddIcon />}>
                  添加字典
                </Button>
              </div>
              <div>
                <InputBase
                  className="w-72 border  px-2 mx-3 shadow"
                  placeholder="请输入字典名称"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        edge="end"
                        sx={{ p: "10px" }}
                        aria-label="请输入字典名称"
                        disableRipple
                        onClick={handleClickSearch}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </div>
            </header>
            {/* 表格主体 */}
            <div className="flex-1 border-t border-l min-h-[580px] overflow-y-auto">
              <DataTable
                tableData={tableData}
                getDictionaryData={getDictionaryData}
                handleSortTable={handleSortTable}
                handleEditDictionart={handleEditDictionart}
              />
            </div>
          </div>
          {open && (
            <AddDidlog
              editItem={editItem}
              open={open}
              close={handleClose}
              getDictionaryData={getDictionaryData}
              class_id={currentClassId}
            />
          )}
        </div>
      </div>
    </SideContext.Provider>
  )
}
