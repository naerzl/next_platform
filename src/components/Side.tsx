"use client"
import React from "react"
import InboxIcon from "@mui/icons-material/MoveToInbox"
import DraftsIcon from "@mui/icons-material/Drafts"
import SendIcon from "@mui/icons-material/Send"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import StarBorder from "@mui/icons-material/StarBorder"
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Collapse,
} from "@mui/material"
function Side() {
  const logo = "static/images/logo.png"
  const [open, setOpen] = React.useState(true)

  const handleClick = () => {
    setOpen(!open)
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
          <img src={logo} alt="" className="w-12 h-12" />
          <div>中铁六局</div>
        </ListSubheader>
      }>
      <ListItemButton color="#bfa">
        <ListItemIcon>
          <SendIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>123</ListItemText>
      </ListItemButton>

      <ListItemButton>
        <ListItemIcon>
          <DraftsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="calendar" />
      </ListItemButton>

      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <InboxIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Inbox" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Starred" />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  )
}

export default Side
