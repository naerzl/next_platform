import React, { ReactNode } from "react"
import { TypeEBSDataList } from "@/app/ebs-data/types"
import { MenuProps, Popconfirm, Spin, Switch } from "antd"
import useSWRMutation from "swr/mutation"
import { reqDeleteEBS, reqGetEBS } from "@/app/ebs-data/api"
import EBSDataContext from "@/app/ebs-data/context/ebsDataContext"
import { ENUM_ATTRIBUTION, ENUM_SUBPARY_CLASS } from "@/libs/const"

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
  const { item, handleGetParentChildren, handleAddEBS, handleEditCustomEBS } = props

  // 删除EBS结构api
  const { trigger: deleteEBSApi } = useSWRMutation("/ebs", reqDeleteEBS)

  // 获取被删除的EBS结构的数据
  const { trigger: getEBSApi } = useSWRMutation("/ebs", reqGetEBS)

  // 菜单选项
  const [items, setItems] = React.useState<MenuProps["items"]>([
    {
      label: "添加",
      key: "2",
      async onClick() {
        const res = await getEBSApi({
          code: item.code,
          level: item.level + 1,
        })
        handleAddEBS(item, res || [], "platform")
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
  ])

  const handleIconAdd = async () => {
    const res = await getEBSApi({
      code: item.code,
      level: item.level + 1,
    })
    handleAddEBS(item, res || [], "platform")
  }

  const handleIconEdit = () => {
    handleEditCustomEBS(item)
  }

  const handleIconDel = async () => {
    // 调佣删除接口
    await deleteEBSApi({ id: item.id, project_id: 1 })
    //   删除成功需要刷新父级节点下面的children
    const parentIndexArr = item.key?.split("-").slice(0, item.key?.split("-").length - 1)
    //   获取父级节点的层级 拿到当前的层级删除最后一个 即是父级层级
    handleGetParentChildren(parentIndexArr as string[])
  }

  // 需要通过数据里面的 is_loop字段判断是否有复制按钮
  const filterItemsOfMenu = async (
    is_loop: string,
    is_system: "platform" | "system" | "userdefined" | "null",
  ) => {
    // 通过item的类型判断是否 该存在修改按钮
    const havaSystemArr =
      is_system == "platform" ? items : items!.filter((item) => item!.key !== "3")

    setItems(havaSystemArr as MenuProps["items"])
  }

  // eslint-disable-next-line no-unused-vars
  const handleOpenChange = (open: boolean) => {
    open && filterItemsOfMenu(item.is_loop, item.is_system)
  }

  const [haveChildren, setHaveChildren] = React.useState(true)

  const initHave2and5 = async () => {
    // 计算当前项的子集还有没有数据
    let count = 0
    if (item.childrenCount) {
      for (const key in item.childrenCount) {
        // @ts-ignore
        count += item.childrenCount[key]
      }
      if (count <= 0) {
        setHaveChildren(false)
      }
      if (item.children!.length > 0) {
        setHaveChildren(true)
      }
    }
  }

  React.useEffect(() => {
    initHave2and5()
  }, [item.children?.length])

  // 点击 字体图片展开功能
  const handleClick = () => {
    ctx.handleExpandChange(true, item)
  }

  // 点击 字体图片关闭功能
  const handleClickClose = () => {
    ctx.handleExpandChange(false, item)
  }

  return (
    <>
      <tr className="h-14 grid grid-cols-11">
        <td
          className="border p-4 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer col-span-3 flex justify-between"
          title={item.name}>
          <div
            className="flex-1 flex-shrink-0  overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ textIndent: `${(item.level - 1) * 10}px` }}>
            {props.children
              ? haveChildren && (
                  <i
                    className="iconfont  icon-xiangxiajiantou  text-[14px] font-bold mr-1.5"
                    onClick={() => {
                      handleClickClose()
                    }}></i>
                )
              : haveChildren && (
                  <i
                    className="iconfont icon-xiangyoujiantou text-[14px] font-bold mr-1.5"
                    onClick={() => {
                      handleClick()
                    }}></i>
                )}

            <span>{item.name}</span>
          </div>
        </td>
        <td className="border p-4 text-center" title={item.code}>
          {item.code}
        </td>
        <td className="border p-4 text-center">{item.unit}</td>
        <td className="border p-4 text-center">
          {item.is_system ? ENUM_ATTRIBUTION.find((el) => el.value == item.is_system)?.label : ""}
        </td>
        <td className="border p-4 text-center">
          {item.subpart_class
            ? ENUM_SUBPARY_CLASS.find((ele) => ele.value == item.subpart_class)?.label
            : ""}
        </td>
        <td className="border p-4 text-center">{item.h_subpart_code}</td>
        <td className="border p-4 text-center">{item.n_subpart_code}</td>
        <td className="border p-4 text-center">
          <Switch className="bg-[#bfbfbf]" checked={item.is_loop == "yes" ? true : false}></Switch>
        </td>
        <td className="border p-4">
          <Spin spinning={false} size="small">
            <div className="text-[#757575] flex gap-x-2.5 w-[6.25rem] justify-center">
              <i
                className="iconfont icon-jia w-4 aspect-square cursor-pointer"
                title="添加"
                onClick={() => {
                  handleIconAdd()
                }}></i>

              <i
                className="iconfont icon-bianji w-4 aspect-square cursor-pointer"
                title="修改"
                onClick={() => {
                  handleIconEdit()
                }}></i>
              {item.is_system !== "system" && (
                <Popconfirm
                  title="您确定删除吗？"
                  description="删除后将无法恢复，是否确定删除?"
                  onConfirm={() => {
                    handleIconDel()
                  }}
                  okText="确定"
                  cancelText="取消"
                  okButtonProps={{ className: "bg-railway_error" }}>
                  <i className="iconfont icon-shanchu w-4 aspect-square" title="删除"></i>
                </Popconfirm>
              )}
            </div>
          </Spin>
        </td>
      </tr>
      {props.children}
    </>
  )
}

export default TableTr
