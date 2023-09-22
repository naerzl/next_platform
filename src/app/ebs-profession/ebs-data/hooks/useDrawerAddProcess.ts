import React from "react"
import { ProcessListData } from "@/app/ebs-profession/ebs-data/types"

export default function useDrawerAddProcess() {
  const [drawerAddProcessOpen, setDrawerAddProcessOpen] = React.useState(false)

  const [editItem, setEditItem] = React.useState<null | ProcessListData>(null)

  const handleCloseDrawerAddProcess = () => {
    setDrawerAddProcessOpen(false)

    setEditItem(null)
  }
  const handleOpenDrawerAddProcess = () => {
    setDrawerAddProcessOpen(true)
  }

  const handleEditeProcessWithDrawer = (item: ProcessListData) => {
    setEditItem(item)
    setDrawerAddProcessOpen(true)
  }

  return {
    drawerAddProcessOpen,
    handleCloseDrawerAddProcess,
    handleOpenDrawerAddProcess,
    editItem,
    handleEditeProcessWithDrawer,
  }
}
