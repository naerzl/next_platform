"use client"

import React from "react"
import { ListItemIcon, MenuItem, Select } from "@mui/material"

const roleOption = [
  { value: "1", label: "阿打发" },
  { value: "2", label: "阿莎" },
  { value: "3", label: "换手机" },
  { value: "4", label: "我回家" },
]

function Page() {
  return (
    <div>
      <Select
        sx={{ flex: 1 }}
        id="role_list"
        placeholder="请选择关联的角色"
        size="small"
        multiple
        value={["1"]}
        fullWidth>
        {roleOption.map((item) => (
          <MenuItem value={item.value} key={item.value}>
            <ListItemIcon>{item.label}</ListItemIcon>
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}

export default Page
