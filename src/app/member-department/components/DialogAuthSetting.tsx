import React from "react"
import { Dialog, DialogTitle, DialogContent, Box, Tab } from "@mui/material"
import { TabContext, TabList, TabPanel } from "@mui/lab"

type Props = {
  open: boolean
  handleCloseDialogAuthSetting: () => void
}

export default function dialogAuthSetting(props: Props) {
  const { open, handleCloseDialogAuthSetting } = props
  const handleCloseDialog = () => {
    handleCloseDialogAuthSetting()
  }

  const [tabsValue, setTabsValue] = React.useState("1")
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabsValue(newValue)
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
          <TabPanel value="1">功能权限</TabPanel>
          <TabPanel value="2">数据权限</TabPanel>
          <TabPanel value="3">操作权限</TabPanel>
        </TabContext>
      </DialogContent>
    </Dialog>
  )
}
