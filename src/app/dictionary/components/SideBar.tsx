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

  const { trigger: getDictionaryClassApi } = useSWRMutation(
    "/dictionary-class",
    reqGetDictionaryClass,
  )
  const { trigger: deleteDictionaryClassApi } = useSWRMutation(
    "/dictionary-class",
    reqDeleteDictionaryClass,
  )

  // dialog关闭
  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleClickAddClass = () => {
    setParentId(undefined)
    setOpenDialog(true)
  }

  const findIcon = (iconName: string) => {
    const obj = iconList.find((icon) => icon.name == iconName)
    return obj ? obj.component : <DraftsIcon fontSize="small" />
  }

  const handleClickAddSub = (side: DictionaryClassData) => {
    // 向dialog组件传递父级id
    setParentId(side.id)
    // 打开弹窗
    setOpenDialog(true)
  }

  // 获取子集分类数据
  const getSubClassList = React.useCallback(async (id: number) => {
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
        setSubClassList([])
        getSubClassList(id)
      }
    }
    getDictionaryData({ class_id: id })
    ctx.changeCurrentClassId(id)
  }

  const handleClickDelete = (id: number, isFirstClass: boolean) => {
    // 判断是否是一级菜单
    if (isFirstClass) {
      // 获取菜单的下表
      const index = ctx.sideBarList.findIndex((item) => item.id === id)
      const length = ctx.sideBarList.length
      // 判断是否是第一个
      if (index - 1 >= 0 && length > 1) {
        const preSideItem = ctx.sideBarList[index - 1]
        setCollapseOpen(preSideItem.id)
        ctx.changeCurrentClassId(preSideItem.id)
        getDictionaryData({ class_id: preSideItem.id })
      } else if (index - 1 < 0 && length > 1) {
        const preSideItem = ctx.sideBarList[index + 1]
        setCollapseOpen(preSideItem.id)
        ctx.changeCurrentClassId(preSideItem.id)
        getDictionaryData({ class_id: preSideItem.id })
      }
      deleteDictionaryClassApi({ id }).then((res) => {
        if (res.code !== STATUS_SUCCESS) return message.error(res.msg)
        message.success("删除成功")
        ctx.changeSideBarList()
      })
    } else {
      const index = subClassList.findIndex((item) => item.id === id)
      const length = subClassList.length
      if (index - 1 >= 0 && length > 1) {
        const preSideItem = ctx.sideBarList[index - 1]
        ctx.changeCurrentClassId(preSideItem.id)
        getDictionaryData({ class_id: preSideItem.id })
      } else if (index - 1 < 0 && length > 1) {
        const preSideItem = ctx.sideBarList[index + 1]
        ctx.changeCurrentClassId(preSideItem.id)
        getDictionaryData({ class_id: preSideItem.id })
      }
      deleteDictionaryClassApi({ id }).then((res) => {
        if (res.code !== STATUS_SUCCESS) return message.error(res.msg)
        message.success("删除成功")
        getSubClassList(collapseOpen)
      })
    }
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
                  onClick={() => handleClickDelete(item.id, true)}
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
                          onClick={() => handleClickDelete(item.id, false)}
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
