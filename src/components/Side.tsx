"use client"
import React from "react"
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined"
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined"
import BallotIcon from "@mui/icons-material/Ballot"
import DatasetLinkedIcon from "@mui/icons-material/DatasetLinked"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import StarBorder from "@mui/icons-material/StarBorder"
import InboxIcon from "@mui/icons-material/MoveToInbox"
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined"
import HdrStrongOutlinedIcon from "@mui/icons-material/HdrStrongOutlined"
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material"
import Link from "next/link"
import { usePathname } from "next/navigation"

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

  return (
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
        onClick={() => {
          handleClickOpen("公共库")
        }}>
        <ListItemIcon>
          <ArchiveOutlinedIcon />
        </ListItemIcon>
        <ListItemText>公共库</ListItemText>
        {openList.includes("公共库") ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={openList.includes("公共库")} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link href="/dictionary">
            <ListItemButton
              className="pl-8"
              sx={pathName == "/dictionary/" ? { bgcolor: "#eef0f1" } : {}}>
              <ListItemIcon>
                <HdrStrongOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>字典库</ListItemText>
            </ListItemButton>
          </Link>

          <Link href="/collection">
            <ListItemButton
              className="pl-8"
              sx={pathName == "/collection/" ? { bgcolor: "#eef0f1" } : {}}>
              <ListItemIcon>
                <HdrStrongOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>表结构库</ListItemText>
            </ListItemButton>
          </Link>
        </List>
      </Collapse>

      <ListItemButton
        onClick={() => {
          handleClickOpen("数据模板")
        }}>
        <ListItemIcon>
          <TuneOutlinedIcon />
        </ListItemIcon>
        <ListItemText>数据模板</ListItemText>
        {openList.includes("数据模板") ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={openList.includes("数据模板")} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link href="/ebs-profession">
            <ListItemButton
              className="pl-8"
              sx={pathName == "/ebs-profession/" ? { bgcolor: "#eef0f1" } : {}}>
              <ListItemIcon>
                <HdrStrongOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>EBS专业列表</ListItemText>
            </ListItemButton>
          </Link>

          <Link href="/engineering">
            <ListItemButton
              className="pl-8"
              sx={pathName == "/engineering/" ? { bgcolor: "#eef0f1" } : {}}>
              <ListItemIcon>
                <HdrStrongOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="工程专业列表" />
            </ListItemButton>
          </Link>

          <Link href="/design-data-list">
            <ListItemButton
              className="pl-8"
              sx={pathName == "/design-data-list/" ? { bgcolor: "#eef0f1" } : {}}>
              <ListItemIcon>
                <HdrStrongOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="设计数据列表" />
            </ListItemButton>
          </Link>
        </List>
      </Collapse>
    </List>
  )
}

export default Side
