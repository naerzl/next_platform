"use client"
import React from "react"
import useSWR from "swr"
import useSWRMutation from "swr/mutation"
import { reqGetCollectionClass } from "./api"
import SideBar from "./components/SideBar"
import CollectionContext from "./context/collectionContext"

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
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
    console.log("class更新了", id, indexStr)
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
    <div className="flex h-full w-full overflow-hidden">
      <CollectionContext.Provider
        value={{
          sideBarList: data ? data : [],
          changeSideBarList: getCollectionClassData,
          currentClassId,
          changeCurrentClassId,
          getSubClassList,
        }}>
        <div className="h-full flex">
          {/* 左侧导航 */}
          <aside className="w-60 h-full  mr-3 bg-white">
            <SideBar />
          </aside>
        </div>
        {children}
      </CollectionContext.Provider>
    </div>
  )
}
