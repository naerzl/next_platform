"use client"
import React from "react"
import useSWR from "swr"
import useSWRMutation from "swr/mutation"
import { reqGetCollectionClass } from "./api"
import SideBar from "./components/SideBar"
import CollectionContext from "./context/collectionContext"
import { Breadcrumbs } from "@mui/material"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"

export default function collectionLayout({ children }: { children: React.ReactNode }) {
  // 获取集合分类接口
  const { data, isLoading, mutate } = useSWR(
    "/structure-collection-class",
    (url) => reqGetCollectionClass(url, { arg: {} }),
    { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false },
  )
  const { trigger: getCollectionClassApi } = useSWRMutation(
    "/structure-collection-class",
    reqGetCollectionClass,
  )

  // 当前侧边栏的id
  const [currentClassId, setCurrentClassId] = React.useState(0)
  const changeCurrentClassId = (currentId: number) => {
    setCurrentClassId(currentId)
  }

  const getCollectionClassData = React.useCallback(async () => {
    // 获取集合分类
  }, [])

  // 获取到分类之后默认设置为第一个分类
  React.useEffect(() => {
    data && data.length > 0 && currentClassId <= 0 && setCurrentClassId(data[0].id)
  }, [data])

  const getSubClassList = async (id: number, indexStr: string) => {
    // 如果不传indexStr的话获取第一层级的
    if (indexStr == "") {
      const res = await getCollectionClassApi({})
      mutate(res, false)
      return
    }
    const indexArr = indexStr.split("-")
    // 深拷贝数据
    const newArr = structuredClone(data)
    // eslint-disable-next-line no-unused-vars
    const res = await getCollectionClassApi({ parent_id: id })
    const str = "newArr[" + indexArr?.join("].children[") + "].children"
    eval(str + "=res")
    mutate(newArr, false)
  }

  if (isLoading) {
    return <></>
  }

  return (
    <CollectionContext.Provider
      value={{
        sideBarList: data ? data : [],
        changeSideBarList: getCollectionClassData,
        currentClassId,
        changeCurrentClassId,
        getSubClassList,
      }}>
      <h3 className="font-bold text-[1.875rem]">表结构库</h3>
      <div className="mb-9 mt-7">
        <Breadcrumbs aria-label="breadcrumb" className="my-2" separator=">">
          <Link underline="hover" color="inherit" href="/dashboard">
            <i className="iconfont icon-homefill" style={{ fontSize: "14px" }}></i>
          </Link>
          <Typography color="text.primary" sx={{ fontSize: "14px" }}>
            表结构库
          </Typography>
        </Breadcrumbs>
      </div>
      <div className="flex-1 flex-shrink-0 overflow-auto bg-white flex">
        <div className="h-full flex">
          {/* 左侧导航 */}
          <aside className="w-60 h-full  mr-3 bg-white">
            <SideBar />
          </aside>
        </div>
        {children}
      </div>
    </CollectionContext.Provider>
  )
}
