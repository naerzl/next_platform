"use client"
import React from "react"
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined"
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"

import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material"
import { usePathname } from "next/navigation"

export const dynamic = "force-dynamic"

const pathList = [
  {
    path: "/design-data-list/",
    open: "数据模板",
  },
  {
    path: "/engineering/",
    open: "数据模板",
  },
  {
    path: "/ebs-profession/",
    open: "数据模板",
  },
  {
    path: "/dictionary/",
    open: "公共库",
  },
  {
    path: "/collection/",
    open: "公共库",
  },
]

function Side() {
  const logo = "/static/images/logo.png"
  const pathName = usePathname()

  const [openList, setOpen] = React.useState<string[]>([])

  // 处理展开合并方法
  const handleClickOpen = (key: string) => {
    if (openList.includes(key)) {
      setOpen((pre) => pre.filter((item) => item !== key))
    } else {
      setOpen((pre) => [...pre, key])
    }
  }

  const changeIcon = (path: string) => {
    return pathName == path ? (
      <i className="w-2 h-2 rounded-full bg-[#44566c]"></i>
    ) : (
      <i className="w-2 h-2 rounded-full border-2 border-[#44566c]"></i>
    )
  }

  React.useEffect(() => {
    const obj = pathList.find((item) => pathName.startsWith(item.path))
    if (obj) {
      setOpen([obj!.open])
    }
  }, [])

  return (
    <>
      <List
        sx={{ width: "100%", maxWidth: "15rem", bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            className="h-16 flex items-center gap-1 max-h-16"
            sx={{ fontSize: "24px" }}>
            <img src={logo} alt="" className="w-10 h-10" />
            <div className="text-base font-bold text-railway_303">工程数字化管理系统</div>
          </ListSubheader>
        }>
        <ListItemButton
          sx={{ color: "#44566c" }}
          onClick={() => {
            handleClickOpen("公共库")
          }}>
          <ListItemIcon className="min-w-0 mr-2.5" sx={{ width: "1.5rem", height: "1.5rem" }}>
            <ArchiveOutlinedIcon />
          </ListItemIcon>
          <ListItemText>公共库</ListItemText>
          {openList.includes("公共库") ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openList.includes("公共库")} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={pathName == "/dictionary/" ? { bgcolor: "#eef0f1" } : {}}
              href="/dictionary">
              <ListItemIcon
                className="min-w-0 mr-2.5 flex justify-center items-center"
                sx={{ width: "1.5rem", height: "1.5rem" }}>
                {changeIcon("/dictionary/")}
              </ListItemIcon>
              <ListItemText
                sx={{ color: pathName.startsWith("/dictionary/") ? "#44566c" : "#8697a8" }}>
                字典库
              </ListItemText>
            </ListItemButton>

            <ListItemButton
              sx={pathName.startsWith("/collection/") ? { bgcolor: "#eef0f1" } : {}}
              href="/collection">
              <ListItemIcon
                className="min-w-0 mr-2.5 flex justify-center items-center"
                sx={{ width: "1.5rem", height: "1.5rem" }}>
                {changeIcon("/collection/")}
              </ListItemIcon>
              <ListItemText
                sx={{ color: pathName.startsWith("/collection/") ? "#44566c" : "#8697a8" }}>
                表结构库
              </ListItemText>
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton
          sx={{ color: "#44566c" }}
          onClick={() => {
            handleClickOpen("数据模板")
          }}>
          <ListItemIcon className="min-w-0 mr-2.5" sx={{ width: "1.5rem", height: "1.5rem" }}>
            <TuneOutlinedIcon />
          </ListItemIcon>
          <ListItemText>数据模板</ListItemText>
          {openList.includes("数据模板") ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openList.includes("数据模板")} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={pathName.startsWith("/ebs-profession/") ? { bgcolor: "#eef0f1" } : {}}
              href="/ebs-profession">
              <ListItemIcon
                className="min-w-0 mr-2.5 flex justify-center items-center"
                sx={{ width: "1.5rem", height: "1.5rem" }}>
                {changeIcon("/ebs-profession/")}
              </ListItemIcon>
              <ListItemText
                sx={{ color: pathName.startsWith("/ebs-profession/") ? "#44566c" : "#8697a8" }}>
                EBS专业列表
              </ListItemText>
            </ListItemButton>

            <ListItemButton
              sx={pathName.startsWith("/engineering/") ? { bgcolor: "#eef0f1" } : {}}
              href="/engineering">
              <ListItemIcon
                className="min-w-0 mr-2.5 flex justify-center items-center"
                sx={{ width: "1.5rem", height: "1.5rem" }}>
                {changeIcon("/engineering/")}
              </ListItemIcon>
              <ListItemText
                primary="工程专业列表"
                sx={{ color: pathName.startsWith("/engineering/") ? "#44566c" : "#8697a8" }}
              />
            </ListItemButton>

            <ListItemButton
              sx={pathName.startsWith("/design-data-list/") ? { bgcolor: "#eef0f1" } : {}}
              href="/design-data-list">
              <ListItemIcon
                className="min-w-0 mr-2.5 flex justify-center items-center"
                sx={{ width: "1.5rem", height: "1.5rem" }}>
                {changeIcon("/design-data-list/")}
              </ListItemIcon>
              <ListItemText
                primary="设计数据列表"
                sx={{ color: pathName.startsWith("/design-data-list/") ? "#44566c" : "#8697a8" }}
              />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </>
  )
}

export default Side
