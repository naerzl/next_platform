"use client"
import React from "react"
import SideBar from "../components/SideBar"
import DataTable from "../components/DataTable"
import {
  Breadcrumbs,
  Button,
  IconButton,
  InputAdornment,
  InputBase,
  Pagination,
} from "@mui/material"
import AddDidlog from "../components/AddDidlog"
import SearchIcon from "@mui/icons-material/Search"
import useSWRMutation from "swr/mutation"
import useSWR from "swr"
import { DictionaryData, ReqGetDictionaryParams } from "../types"
import { reqGetDictionary, reqGetDictionaryClass } from "../api"
import SideContext from "../context/sideContext"
import { DICTIONARY_LIMIT } from "../const"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import AddIcon from "@mui/icons-material/Add"
import { message } from "antd"
import permissionJson from "@/config/permission.json"
import { LayoutContext } from "@/components/LayoutContext"
import NoPermission from "@/components/NoPermission"
import { displayWithPermission } from "@/libs/methods"
import { BasePager } from "@/types/api"

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

  React.useEffect(() => {}, [])

  const { permissionTagList } = React.useContext(LayoutContext)

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

  const [pager, setPager] = React.useState<BasePager>({} as BasePager)

  const getDictionaryClassData = React.useCallback(async () => {
    // 获取字典分类
  }, [])

  // 获取字典数据
  const getDictionaryData = React.useCallback(
    async (option?: GetDictionaryDataOption) => {
      const cloneParams = structuredClone(params)
      if (option) {
        Object.assign(cloneParams, option)
        cloneParams.page = 1
      }

      setParams(cloneParams)
      // 获取字典数据
      getDictionaryApi(cloneParams).then((res) => {
        setTableData(res.items)
        setPager({ page: res.page, limit: res.limit, count: res.count })
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

  const handlePaginationChange = async (val: any, type: keyof ReqGetDictionaryParams) => {
    let newParams = {} as ReqGetDictionaryParams
    for (let swrStateKey in params) {
      // @ts-ignore
      if (params[swrStateKey] && params[swrStateKey] != "null") {
        // @ts-ignore
        newParams[swrStateKey] = params[swrStateKey]
      }
    }
    if (type == "limit") {
      newParams.page = 1
    }
    // @ts-ignore
    newParams[type] = val
    setParams(newParams)
    const res = await getDictionaryApi(newParams)
    setTableData(res.items)
    setPager({ page: res.page, limit: res.limit, count: res.count })
  }

  if (!permissionTagList.includes(permissionJson.dictionary_base_member_read)) {
    return <NoPermission />
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
          <aside className="h-full  mr-3 bg-white border-r overflow-y-auto overflow-x-hidden w-1/6 max-w-sm min-w-[200px] custom-scroll-bar">
            <SideBar />
          </aside>
          <div className="flex-1 flex flex-col  gap-y-2">
            {/* 头部搜索 */}
            <header className="h-12 flex items-center justify-between">
              <div>
                <Button
                  style={displayWithPermission(
                    permissionTagList,
                    permissionJson.dictionary_base_member_write,
                  )}
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
            <div className="flex-1 border-t border-l  overflow-hidden ">
              <div className="overflow-y-auto h-full pb-8 relative">
                <DataTable
                  tableData={tableData}
                  getDictionaryData={getDictionaryData}
                  handleSortTable={handleSortTable}
                  handleEditDictionart={handleEditDictionart}
                />
                <div className="absolute bottom-0 w-full flex justify-center items-center gap-x-2 bg-white border-t">
                  <span>共{pager.count}条</span>
                  <select
                    value={params.limit}
                    className="border"
                    onChange={(event) => {
                      handlePaginationChange(event.target.value, "limit")
                    }}>
                    <option value={10}>10条/页</option>
                    <option value={20}>20条/页</option>
                    <option value={50}>50条/页</option>
                  </select>
                  <Pagination
                    page={params.page}
                    count={pager.count ? Math.ceil(pager.count / pager.limit) : 1}
                    variant="outlined"
                    shape="rounded"
                    onChange={(event, page) => {
                      handlePaginationChange(page, "page")
                    }}
                  />
                </div>
              </div>
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
