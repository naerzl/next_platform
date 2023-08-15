"use client"
import React from "react"
import DraftsIcon from "@mui/icons-material/Drafts"
import SendIcon from "@mui/icons-material/Send"
import BallotIcon from "@mui/icons-material/Ballot"
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import Link from "next/link"
import { usePathname } from "next/navigation"

function Side() {
  const logo = "/static/images/logo.png"
  const pathName = usePathname()
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
          <img src={logo} alt="" className="w-12 h-12" />
          <div>中铁六局</div>
        </ListSubheader>
      }>
      <Link href={"/design-data"}>
        <ListItemButton sx={pathName == "/design-data" ? { bgcolor: "#eef0f1" } : {}}>
          <ListItemIcon>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>设计数据</ListItemText>
        </ListItemButton>
      </Link>

      <Link href={"/dictionary"}>
        <ListItemButton sx={pathName == "/dictionary" ? { bgcolor: "#eef0f1" } : {}}>
          <ListItemIcon>
            <DraftsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>数据字典</ListItemText>
        </ListItemButton>
      </Link>

      <Link href={"/collection"}>
        <ListItemButton sx={pathName == "/collection" ? { bgcolor: "#eef0f1" } : {}}>
          <ListItemIcon>
            <BallotIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>表结构库</ListItemText>
        </ListItemButton>
      </Link>
    </List>
  )
}

export default Side
