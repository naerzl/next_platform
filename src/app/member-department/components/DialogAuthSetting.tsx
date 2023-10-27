import React, { Dispatch, SetStateAction } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Tab,
  List,
  ListItem,
  ListItemButton,
  IconButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Collapse,
} from "@mui/material"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import StarBorder from "@mui/icons-material/StarBorder"
import { MuiTreeSelect } from "mui-tree-selects"

import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import CommentIcon from "@mui/icons-material/Comment"
import { RolesListData } from "@/app/member-department/types"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"

type TreeData = {
  name: string
  id: string
  parent?: string
  children?: TreeData[]
}

type Props = {
  open: boolean
  handleCloseDialogAuthSetting: () => void
}

const data: TreeData[] = [
  {
    name: "123",
    id: "1",
    parent: "0",
    children: [
      {
        name: "222",
        id: "2",
        parent: "1",
      },
    ],
  },
]

export default function dialogAuthSetting(props: Props) {
  const { open, handleCloseDialogAuthSetting } = props
  const handleCloseDialog = () => {
    handleCloseDialogAuthSetting()
  }

  const [tabsValue, setTabsValue] = React.useState("1")
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabsValue(newValue)
  }

  const [checked, setChecked] = React.useState([0])

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const [collapseOpen, setCollapseOpen] = React.useState<string[]>([])

  const handleClickListItemButton = (roleItem: any, indexStr: string) => {
    const index = collapseOpen.findIndex((str) => str == indexStr)
    if (index > -1) {
      const newCollapseOpen = structuredClone(collapseOpen)
      newCollapseOpen.splice(index, 1)
      setCollapseOpen(newCollapseOpen)
    } else {
      setCollapseOpen((prevState) => [...prevState, indexStr])
    }
  }

  const RenderListItem = (arr: any[], indexStr = "") => {
    console.log(arr)
    return arr.map((item: any, index) => {
      let str = indexStr ? `${indexStr}-${index}` : `${index}`
      return (
        <div key={item.id}>
          <ListItemButton
            sx={{
              pl: indexStr ? indexStr?.split("-").length * 2 : 0,
            }}
            onClick={() => handleClickListItemButton(item, str)}>
            <ListItemIcon>
              <Checkbox edge="start" tabIndex={-1} disableRipple />
            </ListItemIcon>
            <ListItemText>{item.name}</ListItemText>
            {item.children && (collapseOpen.includes(str) ? <ExpandLess /> : <ExpandMore />)}
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
    <Dialog onClose={handleCloseDialog} open={open} maxWidth={false}>
      <DialogContent sx={{ px: "40px", py: "30px", width: 1000, height: 760 }}>
        <TabContext value={tabsValue}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="功能权限" value="1" />
              <Tab label="数据权限" value="2" />
              <Tab label="操作权限" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                color: "#303133",
              }}
              component="nav"
              aria-labelledby="nested-list-subheader">
              {RenderListItem(data)}
            </List>
          </TabPanel>
          <TabPanel value="2">数据权限</TabPanel>
          <TabPanel value="3">操作权限</TabPanel>
        </TabContext>
      </DialogContent>
    </Dialog>
  )
}
