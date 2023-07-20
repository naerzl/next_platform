"use client"
import React from "react"
import DraftsIcon from "@mui/icons-material/Drafts"
import { List, ListItemButton, ListItemIcon, ListItemText, Button, Collapse } from "@mui/material"
import SideContext from "../context/sideContext"
import DialogSideBar from "./DialogSideBar"
import { iconList } from "./icon"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
import { DictionaryClassData } from "../types"
import useSWRMutation from "swr/mutation"
import { reqDeleteDictionaryClass, reqGetDictionaryClass } from "../api"
import { STATUS_SUCCESS } from "@/libs/const"
import { GetDictionaryDataOption } from "../page"
import message from "antd-message-react"

interface Props {
  // eslint-disable-next-line no-unused-vars
  getDictionaryData: (options: GetDictionaryDataOption) => void
}

function SideBar(props: Props) {
  const { getDictionaryData } = props
  const [openDialog, setOpenDialog] = React.useState(false)
  const ctx = React.useContext(SideContext)
  const [parentId, setParentId] = React.useState<undefined | number>(undefined)
  const [collapseOpen, setCollapseOpen] = React.useState(-1)
  const [subClassList, setSubClassList] = React.useState<DictionaryClassData[]>([])

  // 获取字典分类api
  const { trigger: getDictionaryClassApi } = useSWRMutation(
    "/dictionary-class",
    reqGetDictionaryClass,
  )
  // 删除字典分类api
  const { trigger: deleteDictionaryClassApi } = useSWRMutation(
    "/dictionary-class",
    reqDeleteDictionaryClass,
  )

  // dialog关闭
  const handleClose = () => {
    setOpenDialog(false)
  }

  // 添加一级分类
  const handleClickAddClass = () => {
    setParentId(undefined)
    setOpenDialog(true)
  }

  // 查找图标方法
  const findIcon = (iconName: string) => {
    const obj = iconList.find((icon) => icon.name == iconName)
    return obj ? obj.component : <DraftsIcon fontSize="small" />
  }

  // 添加子集分类
  const handleClickAddSub = (side: DictionaryClassData) => {
    // 向dialog组件传递父级id
    setParentId(side.id)
    // 打开弹窗
    setOpenDialog(true)
  }

  // 获取子集分类数据
  const getSubClassList = React.useCallback(async (id: number, isEmpty?: boolean) => {
    isEmpty && setSubClassList([])
    const res = await getDictionaryClassApi({ page: 1, limit: 15, parent_id: id })
    if (res.code !== STATUS_SUCCESS) return
    setSubClassList(res.data.items)
  }, [])

  // 点击列表单元项
  const handleClickListItemButton = async (id: number, isFirstClass: boolean) => {
    // 防止点击同一个 会闪的情况
    if (isFirstClass) {
      if (collapseOpen != id) {
        setCollapseOpen(id)
        // 防止切换其它子集数据错乱的情况
        getSubClassList(id, true)
      }
    }
    getDictionaryData({ class_id: id })
    ctx.changeCurrentClassId(id)
  }

  // 一级菜单删除
  const isClassDelete = (preSideItemId: number, isFirstClass?: Boolean) => {
    // 如果是删除的一级菜单 打开上一个或者下一个一级分类的下拉选项
    if (isFirstClass) {
      setCollapseOpen(preSideItemId)
      getSubClassList(preSideItemId, true)
    }
    // 更改上下文里面选中的当前id
    ctx.changeCurrentClassId(preSideItemId)
    // 更新右侧字典表格
    getDictionaryData({ class_id: preSideItemId })
  }

  // 删除字典分类方法
  const handleClickDelete = (id: number, e: Event, isFirstClass: boolean) => {
    // 阻止时间冒泡到按钮 获取侧边栏的影响
    e.stopPropagation()
    const arr = isFirstClass ? ctx.sideBarList : subClassList
    // 判断是否是一级菜单
    // 获取菜单的下表
    const index = arr.findIndex((item) => item.id === id)
    const length = arr.length
    // 判断是否是第一个
    length > 1 && isClassDelete(index - 1 >= 0 ? arr[index - 1].id : arr[index + 1].id, true)
    // 删除字典接口
    deleteDictionaryClassApi({ id }).then((res) => {
      if (res.code !== STATUS_SUCCESS) return message.error(res.msg)
      message.success("删除成功")
      ctx.changeSideBarList()
    })
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
              <ListItemIcon>{findIcon(item.icon)}</ListItemIcon>
              <ListItemText>{item.name}</ListItemText>
              <ListItemIcon className="w-14 justify-end">
                <AddOutlinedIcon onClick={() => handleClickAddSub(item)} fontSize="small" />
                <DeleteOutlinedIcon
                  fontSize="small"
                  onClick={(e: any) => handleClickDelete(item.id, e, true)}
                />
              </ListItemIcon>
            </ListItemButton>
            <Collapse in={item.id == collapseOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {subClassList.map((item) => {
                  return (
                    <ListItemButton
                      sx={{ pl: 4, bgcolor: ctx.currentClassId == item.id ? "#f5f5f5" : "#fff" }}
                      key={item.id}
                      onClick={() => handleClickListItemButton(item.id, false)}>
                      <ListItemIcon>{findIcon(item.icon)}</ListItemIcon>
                      <ListItemText>{item.name}</ListItemText>
                      <ListItemIcon className="w-6 justify-end min-w-0">
                        <DeleteOutlinedIcon
                          fontSize="small"
                          onClick={(e: any) => handleClickDelete(item.id, e, false)}
                        />
                      </ListItemIcon>
                    </ListItemButton>
                  )
                })}
              </List>
            </Collapse>
          </div>
        ))}
      </List>
      <Button
        fullWidth
        variant="outlined"
        sx={{ fontSize: "1.5rem" }}
        className="h-12 border"
        onClick={handleClickAddClass}>
        +
      </Button>
      <DialogSideBar
        close={handleClose}
        open={openDialog}
        parent_id={parentId}
        getSubClassList={getSubClassList}
      />
    </>
  )
}

export default SideBar
