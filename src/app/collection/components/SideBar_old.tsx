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
import { reqDelCollectionClass, reqGetCollectionClass } from "../api"
import CollectionContext from "../context/collectionContext"
import { ReqGetAddCollectionClassResponse, ReqGetAddCollectionResponse } from "../types"
import message from "antd-message-react"

export default function SideBar() {
  const ctx = React.useContext(CollectionContext)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const [handleId, setHandleId] = React.useState(0)
  const [isFirstFlag, setIsFirstFlag] = React.useState(false)
  const handleClickCaidanIcon = (event: any, id: number, flag: boolean) => {
    event.stopPropagation()
    // 设置菜单打开的位置
    setAnchorEl(event.currentTarget)
    // 设置当前点击的侧边栏
    setHandleId(id)

    setIsFirstFlag(flag)
  }

  // 关闭菜单
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const [dialogOpen, setDialogOptn] = React.useState(false)
  const [parentId, setParentId] = React.useState<undefined | number>(undefined)
  const handleDialogClose = () => {
    setDialogOptn(false)
  }

  // 点击添加分类
  const handleClickAddClass = () => {
    setParentId(undefined)
    setDialogOptn(true)
  }

  const { trigger: getSubCollectionClassApi } = useMutation(
    "/structure-collection-class",
    reqGetCollectionClass,
  )

  const [subClassList, setSubClassList] = React.useState<ReqGetAddCollectionClassResponse[]>([])
  // 获取子集分类数据
  const getSubClassList = React.useCallback(async (id: number, isEmpty?: boolean) => {
    isEmpty && setSubClassList([])
    const res = await getSubCollectionClassApi({ parent_id: id })
    setSubClassList(res || [])
  }, [])

  const { trigger: delCollectionClassApi } = useMutation(
    "/structure-collection-class",
    reqDelCollectionClass,
  )

  const [collapseOpen, setCollapseOpen] = React.useState(0)
  // 点击菜单按钮
  const handleClickListItemButton = async (id: number, isFirstClass: boolean) => {
    // 判断是否为1级菜单
    if (isFirstClass) {
      // 判断点击的是否是当前已展开的
      if (collapseOpen != id) {
        setCollapseOpen(id)
        // 防止切换其它子集数据错乱的情况
        getSubClassList(id, true)
      }
      // 设置全局currentId
      ctx.changeCurrentClassId(id)
    }
  }

  const [editItem, setEditItem] = React.useState<undefined | ReqGetAddCollectionClassResponse>()
  const handleClickMenuEdit = () => {
    const arr = isFirstFlag ? ctx.sideBarList : subClassList
    const obj = arr.find((item) => item.id == handleId)
    setEditItem(obj)
    // 打开弹窗
    setDialogOptn(true)
    handleCloseMenu()
  }

  const getBrotherData = (brotherId: number) => {
    // 通过 展开二级变量判断是否为1级
    if (isFirstFlag) {
      setCollapseOpen(brotherId)
      getSubClassList(brotherId, true)
    }
    ctx.changeCurrentClassId(brotherId)
  }

  // 点击菜单删除
  const handleClickMenuDel = async () => {
    if (handleId <= 0) return
    // 判断是否是一级菜单拿到对象的数组
    const arr = isFirstFlag ? ctx.sideBarList : subClassList
    // 找到要删除的对象在数组的位置
    const index = arr.findIndex((item) => item.id === handleId)
    const length = arr.length
    length > 1 && getBrotherData(index - 1 >= 0 ? arr[index - 1].id : arr[index + 1].id)
    await delCollectionClassApi({ id: handleId })
    message.success("删除成功")
    isFirstFlag ? ctx.changeSideBarList() : getSubClassList(collapseOpen)
    handleCloseMenu()
  }

  // 添加子集分类
  const handleClickAddSub = (e: any, side: ReqGetAddCollectionResponse) => {
    e.stopPropagation()
    // 向dialog组件传递父级id
    setParentId(side.id)
    // 打开弹窗
    setDialogOptn(true)
  }

  const dialogSideBarCb = (id: number) => {
    setCollapseOpen(id)
  }
  return (
    <>
      <List
        sx={{
          width: "100%",
          maxWidth: "15rem",
          minWidth: "15rem",
          bgcolor: "background.paper",
          color: "#303133",
        }}
        component="nav"
        aria-labelledby="nested-list-subheader">
        {ctx.sideBarList.map((item) => (
          <div key={item.id}>
            <ListItemButton
              sx={{ bgcolor: ctx.currentClassId == item.id ? "#f5f5f5" : "#fff" }}
              onClick={() => handleClickListItemButton(item.id, true)}>
              <ListItemIcon></ListItemIcon>
              <ListItemText>{item.name}</ListItemText>
              <ListItemIcon className="w-14 justify-end">
                <AddOutlinedIcon fontSize="small" onClick={(e) => handleClickAddSub(e, item)} />
                <DragIndicatorIcon
                  fontSize="small"
                  onClick={(e) => {
                    handleClickCaidanIcon(e, item.id, true)
                  }}
                />
              </ListItemIcon>
            </ListItemButton>
            <Collapse in={item.id == collapseOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {subClassList.map((item) => {
                  return (
                    <div key={item.id}>
                      <ListItemButton
                        sx={{ pl: 4, bgcolor: ctx.currentClassId == item.id ? "#f5f5f5" : "#fff" }}
                        key={item.id}
                        onClick={() => handleClickListItemButton(item.id, false)}>
                        <ListItemIcon></ListItemIcon>
                        <ListItemText>{item.name}</ListItemText>
                        <ListItemIcon className="w-6 justify-end min-w-0">
                          <DragIndicatorIcon
                            fontSize="small"
                            onClick={(e: any) => handleClickCaidanIcon(e, item.id, false)}
                          />
                        </ListItemIcon>
                      </ListItemButton>
                      <Collapse in={item.id == collapseOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {subClassList.map((item) => {
                            return (
                              <ListItemButton
                                sx={{
                                  pl: 4,
                                  bgcolor: ctx.currentClassId == item.id ? "#f5f5f5" : "#fff",
                                }}
                                key={item.id}
                                onClick={() => handleClickListItemButton(item.id, false)}>
                                <ListItemIcon></ListItemIcon>
                                <ListItemText>{item.name}</ListItemText>
                                <ListItemIcon className="w-6 justify-end min-w-0">
                                  <DragIndicatorIcon
                                    fontSize="small"
                                    onClick={(e: any) => handleClickCaidanIcon(e, item.id, false)}
                                  />
                                </ListItemIcon>
                              </ListItemButton>
                            )
                          })}
                        </List>
                      </Collapse>
                    </div>
                  )
                })}
              </List>
            </Collapse>
          </div>
        ))}
      </List>
      <Menu
        id="language"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}>
        <MenuItem onClick={handleClickMenuEdit}>修改</MenuItem>
        <MenuItem onClick={handleClickMenuDel}>删除</MenuItem>
      </Menu>
      <Button
        fullWidth
        variant="outlined"
        sx={{ fontSize: "1.5rem" }}
        className="h-12 border"
        onClick={handleClickAddClass}>
        +
      </Button>
      <DialogSideBar
        open={dialogOpen}
        close={handleDialogClose}
        getSubClassList={getSubClassList}
        parent_id={parentId}
        cb={dialogSideBarCb}
        editItem={editItem}
        setEditItem={setEditItem}
      />
    </>
  )
}
