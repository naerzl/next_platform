import React from "react"
import { PermissionData } from "@/types/api"

export const LayoutContext = React.createContext<{
  permissionList: PermissionData[]
  permissionTagList: string[]
}>({
  permissionList: [],
  permissionTagList: [],
})
