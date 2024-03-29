"use client"
import React from "react"
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Collapse,
  Menu,
  MenuItem,
} from "@mui/material"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import DialogSideBar from "./DialogSideBar"
import useMutation from "swr/mutation"
import { DictionaryClassData } from "../types"
import { message } from "antd"
import SideContext from "../context/sideContext"
import { reqDeleteDictionaryClass } from "../api"
import { iconList } from "./IconEnum"
import Empty from "@/components/Empty"
import { useConfirmationDialog } from "@/components/ConfirmationDialogProvider"
import { displayWithPermission } from "@/libs/methods"
import permissionJson from "@/config/permission.json"
import { LayoutContext } from "@/components/LayoutContext"

export default function sideBar() {
  // 获取上下文来共享全局变量
  const ctx = React.useContext(SideContext)

  // 控制菜单的位置
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  // 控制菜单关闭和打开
  const open = Boolean(anchorEl)

  const { permissionTagList } = React.useContext(LayoutContext)

  // 获取到点击菜单要处理的Class 的id
  const [handleId, setHandleId] = React.useState(0)
  // 点击菜单事件
  const handleClickCaidanIcon = (event: any, id: number, str: string) => {
    event.stopPropagation()
    // 设置菜单打开的位置
    setAnchorEl(event.currentTarget)
    // 设置当前点击的侧边栏
    setHandleId(id)
    // 设置被点击的菜单要处理的层级
    setAddIndexStr(str)
  }

  // 关闭菜单
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  // 控制添加class的对话框变量
  const [dialogOpen, setDialogOptn] = React.useState(false)
  // 父级id
  const [parentId, setParentId] = React.useState<undefined | number>(undefined)
  // 添加子集和点击菜单存储被点击的层级
  const [addIndexStr, setAddIndexStr] = React.useState<string>("")
  // 关闭对话框

  const { showConfirmationDialog: handleConfirm } = useConfirmationDialog()

  const handleDialogClose = () => {
    setDialogOptn(false)
  }

  // 点击添加分类
  const handleClickAddClass = () => {
    setParentId(undefined)
    setLevel(1)
    setDialogOptn(true)
  }

  // 删除分类接口
  const { trigger: delDictionaryClassApi } = useMutation(
    "/dictionary-class",
    reqDeleteDictionaryClass,
  )

  const [level, setLevel] = React.useState(1)
  // 控制分类的展开折叠  存储格式为层级（xxx-xxx-xxx）
  const [collapseOpen, setCollapseOpen] = React.useState<string[]>([])

  // 点击菜单按钮
  const handleClickListItemButton = async (id: number, indexStr: string) => {
    // 如果展开的层级不相同 则更新
    if (collapseOpen.includes(indexStr)) {
      setCollapseOpen((prevState) => prevState.filter((item) => item != indexStr))
      // 防止切换其它子集数据错乱的情况
    } else {
      setCollapseOpen(Array.from(new Set([...collapseOpen, indexStr])))
    }
    // 设置全局currentId
    ctx.changeCurrentClassId(id)
    // 获取对象的子集数据
    ctx.getSubClassList(id, indexStr)
    // 如果是在其他的页面则跳转collection页面
  }

  // 存储编辑的对象
  const [editItem, setEditItem] = React.useState<undefined | DictionaryClassData>()
  // 点击菜单编辑按钮
  const handleClickMenuEdit = () => {
    const indexArr = addIndexStr.split("-")
    // eslint-disable-next-line no-unused-vars
    const arr = ctx.sideBarList
    const obj = eval(`arr[${indexArr.join("].children[")}]`)
    setEditItem(obj)
    // 打开弹窗
    setDialogOptn(true)
    handleCloseMenu()
  }

  // 点击菜单删除
  const handleClickMenuDel = () => {
    handleConfirm("你确定要删除吗？", async () => {
      if (handleId <= 0) return
      const indexArr = addIndexStr.split("-")
      // eslint-disable-next-line no-unused-vars
      const arr = ctx.sideBarList
      const resultArr = indexArr.length > 1 ? indexArr.slice(0, indexArr.length - 1) : indexArr

      const id = eval(`arr[${resultArr.join("].children[")}].id`)
      handleCloseMenu()
      await delDictionaryClassApi({ id: handleId })
      message.success("删除成功")

      ctx.getSubClassList(id, indexArr.length > 1 ? resultArr.join("-") : "")
    })
  }

  // 添加子集分类
  const handleClickAddSub = (e: any, side: DictionaryClassData, indexStr: string) => {
    e.stopPropagation()
    setAddIndexStr(indexStr)
    setLevel(indexStr.split("-").length + 1)
    // 向dialog组件传递父级id
    setParentId(side.id)
    // 打开弹窗
    setDialogOptn(true)
  }

  // 添加分类后的回调函数
  const dialogSideBarCb = (id: number, isEdit?: boolean) => {
    // setCollapseOpen(addIndexStr)
    const newStr: string = isEdit ? addIndexStr.substring(0, addIndexStr.length - 2) : addIndexStr
    ctx.getSubClassList(id, newStr)
  }

  const RenderListItem = (arr: any[], indexStr = "") => {
    return arr.map((item, index) => {
      let str = indexStr ? `${indexStr}-${index}` : `${index}`
      return (
        <div key={item.id}>
          <ListItemButton
            className="py-5"
            sx={{
              bgcolor: ctx.currentClassId == item.id ? "#f5f5f5" : "#fff",
              pl: indexStr ? indexStr?.split("-").length * 2 + 2 : 2,
            }}
            onClick={() => handleClickListItemButton(item.id, str)}>
            <ListItemIcon>
              {iconList.find((icon) => icon.name == item.icon)?.component}
            </ListItemIcon>
            <ListItemText>{item.name}</ListItemText>
            <ListItemIcon className="w-14 justify-end">
              {str?.split("-").length < 3 && (
                <AddOutlinedIcon
                  style={displayWithPermission(
                    permissionTagList,
                    permissionJson.dictionary_base_member_write,
                  )}
                  fontSize="small"
                  onClick={(e) => handleClickAddSub(e, item, str)}
                />
              )}
              {(permissionTagList.includes(permissionJson.dictionary_base_member_update) ||
                permissionTagList.includes(permissionJson.dictionary_base_member_update)) && (
                <DragIndicatorIcon
                  fontSize="small"
                  onClick={(e) => {
                    handleClickCaidanIcon(e, item.id, str)
                  }}
                />
              )}
            </ListItemIcon>
          </ListItemButton>
          <Collapse in={collapseOpen.includes(str)} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children && item.children.length > 0 ? (
                RenderListItem(item.children, str)
              ) : (
                <></>
              )}
            </List>
          </Collapse>
        </div>
      )
    })
  }

  return (
    <>
      {ctx.sideBarList.length > 0 ? (
        <List
          sx={{
            width: "100%",
            color: "#303133",
          }}
          component="nav"
          aria-labelledby="nested-list-subheader">
          {RenderListItem(ctx.sideBarList)}
        </List>
      ) : (
        <Empty
          className="w-full flex flex-col justify-center items-center"
          fontSize="2rem"
          color="#dce0e6"
          text={<div>暂时还没有数据</div>}></Empty>
      )}
      <Menu
        sx={{ zIndex: "10" }}
        id="language"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}>
        <MenuItem
          onClick={handleClickMenuEdit}
          style={displayWithPermission(
            permissionTagList,
            permissionJson.dictionary_base_member_update,
          )}>
          修改
        </MenuItem>

        <MenuItem
          onClick={handleClickMenuDel}
          style={displayWithPermission(
            permissionTagList,
            permissionJson.dictionary_base_member_delete,
          )}>
          删除
        </MenuItem>
      </Menu>
      <Button
        fullWidth
        variant="outlined"
        sx={{ fontSize: "1.5rem" }}
        className="h-12 border"
        onClick={handleClickAddClass}
        style={displayWithPermission(
          permissionTagList,
          permissionJson.dictionary_base_member_write,
        )}>
        +
      </Button>
      {dialogOpen && (
        <DialogSideBar
          open={dialogOpen}
          close={handleDialogClose}
          parent_id={parentId}
          level={level}
          cb={dialogSideBarCb}
          editItem={editItem}
          setEditItem={setEditItem}
        />
      )}
    </>
  )
}
