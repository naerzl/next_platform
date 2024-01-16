"use client"
import * as React from "react"
import { useSearchParams } from "next/navigation"
import { TypeEBSDataList } from "@/app/ebs-profession/ebs-data/types"
import useDebounce from "@/hooks/useDebounce"

interface Props {
  treeData: TypeEBSDataList[]
  // eslint-disable-next-line no-unused-vars
  getSubEBSData: (info: Info, type: boolean) => Promise<any>
  // eslint-disable-next-line no-unused-vars
  onChecked?: (checkedValue: any[], checked: boolean, checkedEBSList: TypeEBSDataList[]) => void
  checkArr: number[]
  checkedEBSList: TypeEBSDataList[]
}

type Info = {
  ebsItem: TypeEBSDataList
  pos: string
}

export default function Tree(props: Props) {
  const { treeData, getSubEBSData, onChecked, checkArr, checkedEBSList } = props

  let checkArrItem = React.useRef<TypeEBSDataList[]>(checkedEBSList)

  const [expand, setExpand] = React.useState<string[]>([])
  const [emptyChildren, setEmptyChildren] = React.useState<String[]>([])
  const [topSelect, setTopSelect] = React.useState<string>("")

  const handleExpand = async (val: string, type: boolean, info: Info) => {
    const newExpand = structuredClone(expand)
    if (type) {
      newExpand.push(val)
      setExpand(newExpand)
      const res = await getSubEBSData(info, type)
      if (res <= 0) {
        setEmptyChildren([...emptyChildren, val])
      }
      return
    }
    setExpand(newExpand.filter((item) => !item.startsWith(val)))
    setEmptyChildren((prevState) => prevState.filter((item) => !item.startsWith(val)))
    await getSubEBSData(info, type)
  }

  const [checked, setChecked] = React.useState<number[]>([])
  const [checkedEBSItem, setCheckEBSItem] = React.useState<TypeEBSDataList[]>(checkArrItem.current)

  const handleChecked = (value: number, type: boolean, item: TypeEBSDataList) => {
    const newChecked = structuredClone(checked)
    const cloneCheckedEBSItem = structuredClone(checkedEBSItem)

    if (type) {
      newChecked.push(value)
      cloneCheckedEBSItem.push(item)
      setChecked(newChecked)
      setCheckEBSItem(cloneCheckedEBSItem)
      onChecked?.(newChecked, type, cloneCheckedEBSItem)
      return
    }
    const index = newChecked.indexOf(value)
    if (index >= 0) {
      newChecked.splice(index, 1)
      cloneCheckedEBSItem.splice(index, 1)
    }
    setChecked(newChecked)
    setCheckEBSItem(cloneCheckedEBSItem)
    onChecked?.(newChecked, type, cloneCheckedEBSItem)
  }

  const renderName = (item: TypeEBSDataList): string => {
    let name = item.extend && item.extend.name ? item.extend.name : item.name
    if (item.is_loop) {
      name += `[${name}仅作为基础的工程结构模板，所有墩的工程结构基于此创建，已创建的墩不受影响。]`
    }
    return name
  }

  const [isRotating, setIsRotating] = React.useState(false)

  const { run: handleRotaing } = useDebounce(() => {
    setIsRotating(true)
    setTimeout(() => {
      setIsRotating(false)
    }, 1000)
  })

  const ArrToTree = (arr?: TypeEBSDataList[], indexStr = "") => {
    return arr?.map((item, index) => {
      let str = indexStr ? `${indexStr}-${index}` : `${index}`

      let strArr = str.split("-")

      return (
        <ul key={str + item.id}>
          <li
            className="flex items-center gap-x-2"
            style={{ paddingLeft: str.split("-").length * 16 + "px" }}>
            <div className="aspect-square h-6 flex justify-center items-center">
              {emptyChildren.includes(str) ? (
                <i
                  className={`iconfont  icon-shuaxin  font-bold cursor-pointer transition ${
                    isRotating ? "rotating" : ""
                  }`}
                  onClick={() => {
                    handleRotaing()
                    handleExpand(str, true, { ebsItem: item, pos: str })
                  }}></i>
              ) : expand.includes(str) ? (
                <i
                  className="iconfont icon-xiangxiajiantou font-bold cursor-pointer"
                  onClick={() => {
                    handleExpand(str, false, { ebsItem: item, pos: str })
                  }}></i>
              ) : (
                <i
                  className="iconfont icon-xiangyoujiantou font-bold cursor-pointer"
                  onClick={() => {
                    handleExpand(str, true, { ebsItem: item, pos: str })
                  }}></i>
              )}
            </div>

            {str.startsWith(topSelect) && (
              <div className="flex">
                {checked.includes(item.id) ? (
                  <i
                    className="w-4 h-4 border bg-railway_blue cursor-pointer"
                    onClick={() => {
                      console.log(strArr)
                      if (strArr.length == 1) {
                        setTopSelect("")
                      }
                      handleChecked(item.id, false, item)
                    }}></i>
                ) : (
                  <i
                    className="w-4 h-4 border cursor-pointer"
                    onClick={() => {
                      if (strArr.length == 1) {
                        setTopSelect(strArr[0])
                      }
                      handleChecked(item.id, true, item)
                    }}></i>
                )}
              </div>
            )}

            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              {renderName(item)}
            </span>
          </li>
          {ArrToTree(item.children, str)}
        </ul>
      )
    })
  }

  return (
    <>
      <div>{ArrToTree(treeData)}</div>
    </>
  )
}
