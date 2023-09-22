import React, { ReactNode } from "react"
import { TypeEBSDataList } from "@/app/ebs-profession/ebs-data/types"
import useSWRMutation from "swr/mutation"
import { reqDeleteEBS, reqGetEBS } from "@/app/ebs-profession/ebs-data/api"
import EBSDataContext from "@/app/ebs-profession/ebs-data/context/ebsDataContext"
import { ENUM_ATTRIBUTION, ENUM_SUBPARY_CLASS } from "@/libs/const"
import { IconButton, Menu, MenuItem, Switch, Tooltip } from "@mui/material"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import SpeedDial from "@mui/material/SpeedDial"
import SpeedDialIcon from "@mui/material/SpeedDialIcon"
import SpeedDialAction from "@mui/material/SpeedDialAction"

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

type TypeSpeedDial = {
  icon: React.JSX.Element
  name: string
  key: string
}

const actions: TypeSpeedDial[] = [
  { icon: <SearchOutlinedIcon />, name: "查看工序", key: "look" },
  { icon: <AddOutlinedIcon />, name: "添加EBS结构", key: "add" },
  { icon: <EditOutlinedIcon />, name: "修改EBS结构", key: "edit" },
  { icon: <DeleteIcon />, name: "删除EBS结构", key: "del" },
]

export default function tableTr(props: Props) {
  const ctx = React.useContext(EBSDataContext)
  const { item, handleGetParentChildren, handleAddEBS, handleEditCustomEBS } = props

  // 删除EBS结构api
  const { trigger: deleteEBSApi } = useSWRMutation("/ebs", reqDeleteEBS)

  // 获取被删除的EBS结构的数据
  const { trigger: getEBSApi } = useSWRMutation("/ebs", reqGetEBS)

  const handleIconAdd = async () => {
    const res = await getEBSApi({
      code: item.code,
      level: item.level + 1,
    })
    handleAddEBS(item, res || [], "platform")
    handleCloseMenu()
  }

  const handleIconLookProcess = () => {
    // 查看工序
  }

  const handleIconEdit = () => {
    handleEditCustomEBS(item)
    handleCloseMenu()
  }

  const handleIconDel = async () => {
    // 调佣删除接口
    await deleteEBSApi({ id: item.id, project_id: 1 })
    //   删除成功需要刷新父级节点下面的children
    const parentIndexArr = item.key?.split("-").slice(0, item.key?.split("-").length - 1)
    //   获取父级节点的层级 拿到当前的层级删除最后一个 即是父级层级
    handleGetParentChildren(parentIndexArr as string[])
    handleCloseMenu()
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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClickMenuIcon = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleClickSpeedDialAction = (action: TypeSpeedDial) => {
    console.log(action)
    switch (action.key) {
      case "look":
        handleIconLookProcess()
        break
      case "add":
        handleIconAdd()
        break
      case "edit":
        handleIconEdit()
        break
      case "del":
        handleIconDel()
        break
      default:
    }
  }
  return (
    <>
      <tr className="h-14 grid grid-cols-12 border-b">
        <td
          className="overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer col-span-3 flex justify-between items-center pl-4"
          title={item.name}
          onClick={() => {
            if (!haveChildren) return
            if (props.children) {
              handleClickClose()
            } else {
              handleClick()
            }
          }}>
          <div
            className="flex-1 flex-shrink-0  overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ textIndent: `${(item.level - 1) * 16}px` }}>
            {props.children ? (
              <i
                className="iconfont  icon-xiangxiajiantou  text-[14px] font-bold mr-1.5"
                style={haveChildren ? {} : { visibility: "hidden" }}></i>
            ) : (
              <i
                style={haveChildren ? {} : { visibility: "hidden" }}
                className="iconfont icon-xiangyoujiantou text-[14px] font-bold mr-1.5"></i>
            )}

            <span>{item.name}</span>
          </div>
        </td>
        <td
          className="pl-4 leading-[55px] whitespace-nowrap text-ellipsis overflow-hidden"
          title={item.code}>
          {item.code}
        </td>
        <td className="flex justify-between items-center pl-4">{item.unit}</td>
        <td className="flex justify-between items-center pl-4">
          {item.is_system ? ENUM_ATTRIBUTION.find((el) => el.value == item.is_system)?.label : ""}
        </td>
        <td className="flex justify-between items-center pl-4">
          {item.subpart_class
            ? ENUM_SUBPARY_CLASS.find((ele) => ele.value == item.subpart_class)?.label
            : ""}
        </td>
        <td className="flex justify-between items-center pl-4">{item.h_subpart_code}</td>
        <td className="flex justify-between items-center pl-4">{item.n_subpart_code}</td>
        <td className="flex justify-between items-center pl-4">
          <Switch checked={item.is_loop == "yes"}></Switch>
        </td>
        <td className="flex flex-col items-center justify-center  text-ellipsis overflow-hidden">
          <p>{item.related_ebs ? item.related_ebs.code : ""}</p>
          <p>{item.related_ebs ? item.related_ebs.name : ""}</p>
        </td>
        <td className="flex justify-between items-center pl-4 relative">
          <SpeedDial
            direction="up"
            ariaLabel="SpeedDial basic example"
            icon={<SpeedDialIcon />}
            sx={{ position: "absolute", bottom: "6px", left: 0, zIndex: 1300 }}>
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => {
                  handleClickSpeedDialAction(action)
                }}
              />
            ))}
          </SpeedDial>
        </td>
      </tr>
      {props.children}
    </>
  )
}
