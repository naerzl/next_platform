import React, { ReactNode } from "react"
import { TypeEBSDataList } from "@/app/ebs-profession/ebs-data/types"
import useSWRMutation from "swr/mutation"
import { reqDeleteEBS, reqGetEBS } from "@/app/ebs-profession/ebs-data/api"
import EBSDataContext from "@/app/ebs-profession/ebs-data/context/ebsDataContext"
import { ENUM_ATTRIBUTION, ENUM_SUBPARY_CLASS } from "@/libs/const"
import { IconButton, Menu, MenuItem, Switch, Tooltip } from "@mui/material"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import { useConfirmationDialog } from "@/components/ConfirmationDialogProvider"
import { displayWithPermission } from "@/libs/methods"
import permissionJson from "@/config/permission.json"
import { LayoutContext } from "@/components/LayoutContext"

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
  // eslint-disable-next-line no-unused-vars
  handleOpenDrawerProcess: (item: TypeEBSDataList) => void
}

export type Type_Is_system = "platform" | "system" | "userdefined"

export default function tableTr(props: Props) {
  const ctx = React.useContext(EBSDataContext)

  const { permissionTagList } = React.useContext(LayoutContext)

  const {
    item,
    handleGetParentChildren,
    handleAddEBS,
    handleEditCustomEBS,
    handleOpenDrawerProcess,
  } = props

  const { showConfirmationDialog: handleConfirm } = useConfirmationDialog()

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
    handleOpenDrawerProcess(item)
    handleCloseMenu()
  }

  const handleIconEdit = () => {
    handleEditCustomEBS(item)
    handleCloseMenu()
  }

  const handleIconDel = () => {
    handleConfirm("你确定要删除吗？", async () => {
      // 调佣删除接口
      await deleteEBSApi({ id: item.id, project_id: 1 })
      //   删除成功需要刷新父级节点下面的children
      const parentIndexArr = item.key?.split("-").slice(0, item.key?.split("-").length - 1)
      //   获取父级节点的层级 拿到当前的层级删除最后一个 即是父级层级
      handleGetParentChildren(parentIndexArr as string[])
      handleCloseMenu()
    })
  }

  const [haveChildren, setHaveChildren] = React.useState(true)

  const initHave2and5 = async () => {
    // 计算当前项的子集还有没有数据
    // let count = 0
    // if (item.childrenCount) {
    //   for (const key in item.childrenCount) {
    //     // @ts-ignore
    //     count += item.childrenCount[key]
    //   }
    //   if (count <= 0) {
    //     setHaveChildren(false)
    //   }
    //   if (item.children!.length > 0) {
    //     setHaveChildren(true)
    //   }
    // }
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

  return (
    <>
      <tr
        className={
          "h-14 grid grid-cols-12 border-b " + (item.is_system == "platform" ? "bg-amber-200" : "")
        }>
        <td
          className="overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer col-span-3 flex justify-between items-center pl-4"
          title={item.name}
          onClick={() => {
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
              <i className="iconfont  icon-xiangxiajiantou  text-[14px] font-bold mr-1.5"></i>
            ) : (
              <i className="iconfont icon-xiangyoujiantou text-[14px] font-bold mr-1.5"></i>
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
          <Switch
            checked={item.is_loop == 1}
            disabled={
              !permissionTagList.includes(permissionJson.list_of_ebs_majors_member_update)
            }></Switch>
        </td>
        <td className="flex flex-col items-center justify-center  text-ellipsis overflow-hidden">
          <p>{item.related_ebs ? item.related_ebs.code : ""}</p>
          <p>{item.related_ebs ? item.related_ebs.name : ""}</p>
        </td>
        <td className="flex justify-between items-center pl-4">
          <div className="text-[#757575] flex gap-x-2.5 w-[6.25rem] justify-start">
            <i
              className="iconfont icon-gengduo text-[1.25rem] cursor-pointer"
              onMouseEnter={handleClickMenuIcon}></i>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              MenuListProps={{
                "aria-labelledby": "basic-button",
                sx: { boxShadow: "none" },
              }}>
              <div className="flex">
                {item.is_loop == 1 && item.name.includes("#桩") && (
                  <MenuItem
                    onClick={handleIconLookProcess}
                    sx={{ p: 0 }}
                    style={displayWithPermission(
                      permissionTagList,
                      permissionJson.ebs_specialty_list_process_member_read,
                    )}>
                    <div className="flex gap-x-1.5 items-center">
                      <Tooltip title="查看工序">
                        <IconButton>
                          <SearchOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </MenuItem>
                )}
                <MenuItem
                  onClick={handleIconAdd}
                  sx={{ p: 0 }}
                  style={displayWithPermission(
                    permissionTagList,
                    permissionJson.list_of_ebs_majors_member_write,
                  )}>
                  <div className="flex gap-x-1.5 items-center">
                    <Tooltip title="添加EBS结构">
                      <IconButton>
                        <AddOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </MenuItem>
                <MenuItem
                  onClick={handleIconEdit}
                  sx={{ p: 0 }}
                  style={displayWithPermission(
                    permissionTagList,
                    permissionJson.list_of_ebs_majors_member_update,
                  )}>
                  <div className="flex gap-x-1.5 items-center">
                    <Tooltip title="修改EBS结构">
                      <IconButton>
                        <EditOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </MenuItem>
                <MenuItem
                  onClick={handleIconDel}
                  sx={{ p: 0 }}
                  style={displayWithPermission(
                    permissionTagList,
                    permissionJson.list_of_ebs_majors_member_delete,
                  )}>
                  <div className="flex gap-x-1.5 items-center">
                    <Tooltip title="删除EBS结构">
                      <IconButton>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </MenuItem>
              </div>
            </Menu>
          </div>
        </td>
      </tr>
      {props.children}
    </>
  )
}
