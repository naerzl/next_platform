import React, { ReactNode } from "react"
import { TypeEBSDataList } from "@/app/ebs-data/types"
import { Dropdown, MenuProps } from "antd"
import useSWRMutation from "swr/mutation"
import { reqDeleteEBS, reqGetEBS, reqPostEBS } from "@/app/ebs-data/api"
import EBSDataContext from "@/app/ebs-data/context/ebsDataContext"

interface Props {
  item: TypeEBSDataList
  children?: ReactNode
  // eslint-disable-next-line no-unused-vars
  handleGetParentChildren: (parentIndexArr: string[]) => void
  handleAddEBS: (
    // eslint-disable-next-line no-unused-vars
    item: TypeEBSDataList,
    // eslint-disable-next-line no-unused-vars
    delDataList: TypeEBSDataList[],
    // eslint-disable-next-line no-unused-vars
    type: Type_Is_system,
  ) => void
  // eslint-disable-next-line no-unused-vars
  handleAddCustomEBS: (item: TypeEBSDataList, type: Type_Is_system) => void
  // eslint-disable-next-line no-unused-vars
  handleEditCustomEBS: (item: TypeEBSDataList) => void
}

export type Type_Is_system = "platform" | "system" | "userdefined"

function TableTr(props: Props) {
  const ctx = React.useContext(EBSDataContext)
  const { item, handleGetParentChildren, handleAddEBS, handleAddCustomEBS, handleEditCustomEBS } =
    props

  // 删除EBS结构api
  const { trigger: deleteEBSApi } = useSWRMutation("/ebs", reqDeleteEBS)

  // 获取被删除的EBS结构的数据
  const { trigger: getEBSApi } = useSWRMutation("/ebs", reqGetEBS)

  // 获取被删除的EBS结构的数据
  const { trigger: postEBSApi } = useSWRMutation("/ebs", reqPostEBS)

  // 菜单选项
  const [items, setItems] = React.useState<MenuProps["items"]>([
    {
      label: "复制",
      key: "1",
      async onClick() {
        const parentIndexArr = item.key
          ?.split("-")
          .slice(0, item.key?.split("-").length - 1) as string[]
        const parentItem = eval(`ctx.tableData[${parentIndexArr.join("].children[")}]`)
        await postEBSApi({
          is_copy: 1,
          ebs_id: item.id,
          project_id: 1,
          is_system: item.is_system,
          next_ebs_id: parentItem.id,
        })
        handleGetParentChildren(parentIndexArr as string[])
      },
    },
    {
      label: "添加",
      key: "2",
      async onClick() {
        const res = await getEBSApi({
          project_id: 1,
          code: item.code,
          is_hidde: 1,
          level: item.level + 1,
        })
        handleAddEBS(item, res || [], "system")
      },
    },
    {
      label: "修改",
      key: "3",
      onClick() {
        handleEditCustomEBS(item)
      },
    },
    {
      label: "删除",
      key: "4",
      async onClick() {
        // 调佣删除接口
        await deleteEBSApi({ id: item.id, project_id: 1 })
        //   删除成功需要刷新父级节点下面的children
        const parentIndexArr = item.key?.split("-").slice(0, item.key?.split("-").length - 1)
        //   获取父级节点的层级 拿到当前的层级删除最后一个 即是父级层级
        handleGetParentChildren(parentIndexArr as string[])
      },
    },
    {
      label: "添加自定义",
      key: "5",
      onClick() {
        handleAddCustomEBS(item, "userdefined")
      },
    },
  ])

  // 需要通过数据里面的 is_loop字段判断是否有复制按钮
  const filterItemsOfMenu = async (
    is_loop: string,
    is_system: "platform" | "system" | "userdefined" | "null",
  ) => {
    // 通过是否可循环判断 是否该存在复制按钮
    const havaLoopArr =
      is_loop == "no" || is_system != "null"
        ? items!.filter((item) => {
            // item!.key !== "1"
            return true
          })
        : items

    // 通过item的类型判断是否 该存在修改按钮
    const havaSystemArr =
      is_system == "userdefined" ? havaLoopArr : havaLoopArr!.filter((item) => item!.key !== "3")

    // 获取当前节点下面是否有子节点
    const res = await getEBSApi({
      project_id: 1,
      level: item.level + 1,
      code: item.code,
    })

    const parentIndexArr = item.key
      ?.split("-")
      .slice(0, item.key?.split("-").length - 1) as string[]

    if (parentIndexArr.length == 0)
      return setItems(havaSystemArr?.filter((item) => item!.key != "5") as MenuProps["items"])

    const parentItem = eval(`ctx.tableData[${parentIndexArr.join("].children[")}]`)

    // 判断 过滤掉5 的菜单
    const resArrNo5 =
      // 如果没有任何数据 且当前类型不是 自定义 （即系统最后一级）
      (res.length == 0 && is_system == "system") ||
      //   如果当前节点类型为自定义 且 父级类型不为自定义 （即第一层自定义）
      (is_system == "userdefined" && parentItem.is_system != "userdefined") ||
      //   如果 有有子集 且子集元素 是自定义
      (res.length > 0 && res[0].is_system == "userdefined")
        ? havaSystemArr
        : havaSystemArr!.filter((item) => item!.key != "5")

    const resNo2 =
      (res.length > 0 && res[0].is_system == "userdefined") ||
      is_system == "userdefined" ||
      res.length == 0
        ? resArrNo5?.filter((item) => item!.key != "2")
        : resArrNo5

    setItems(resNo2 as MenuProps["items"])
  }

  const handleOpenChange = (open: boolean) => {
    open && filterItemsOfMenu(item.is_loop, item.is_system)
  }

  // 点击 字体图片展开功能
  const handleClick = () => {
    ctx.handleExpandChange(true, item)
  }

  // 点击 字体图片关闭功能
  const handleClickClose = () => {
    ctx.handleExpandChange(false, item)
  }

  // 右键唤醒菜单事件
  const handleClickContextMenu = (
    event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>,
  ) => {
    event.preventDefault()
  }
  return (
    <>
      <tr className="h-14 grid grid-cols-8">
        <Dropdown
          onOpenChange={(open) => {
            handleOpenChange(open)
          }}
          menu={{
            items,
          }}
          trigger={["contextMenu"]}>
          <td
            className="border p-4 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
            style={{ textIndent: `${(item.level - 1) * 10}px` }}
            title={item.name}
            onContextMenu={(event) => {
              handleClickContextMenu(event)
            }}>
            {props.children ? (
              <i
                className="iconfont  icon-xiangxiajiantou  text-[14px] font-bold mr-1.5"
                onClick={() => {
                  handleClickClose()
                }}></i>
            ) : (
              <i
                className="iconfont icon-xiangyoujiantou text-[14px] font-bold mr-1.5"
                onClick={() => {
                  handleClick()
                }}></i>
            )}

            <span>{item.name}</span>
          </td>
        </Dropdown>
        <td className="border p-4"></td>
        <td className="border p-4">{item.code}</td>
        <td className="border p-4">{item.unit}</td>
        <td className="border p-4"></td>
        <td className="border p-4"></td>
        <td className="border p-4"></td>
        <td className="border p-4"></td>
      </tr>
      {props.children}
      {/*<DialogEBS*/}
      {/*  isEdit={isEdit}*/}
      {/*  open={dialogOpen}*/}
      {/*  item={item}*/}
      {/*  addType={addType}*/}
      {/*  changeDialogOpen={changeDialogOpen}*/}
      {/*  changeIsEdit={changeIsEdit}*/}
      {/*  deletedDataList={deletedDataList}></DialogEBS>*/}
    </>
  )
}

export default TableTr
