import React from "react"
import { ProcessListData } from "@/app/ebs-profession/ebs-data/types"

export default function useDialogApplyProcess() {
  const [dialogApplyProcessOpen, setDialogApplyProcessOpen] = React.useState(false)

  const [editItem, setEditItem] = React.useState<null | ProcessListData>(null)

  const handleCloseDrawerAddProcess = () => {
    setDialogApplyProcessOpen(false)

    setEditItem(null)
  }
  const handleOpenDrawerAddProcess = () => {
    setDialogApplyProcessOpen(true)
  }

  const handleEditeProcessWithDrawer = (item: ProcessListData) => {
    setEditItem(item)
    setDialogApplyProcessOpen(true)
  }

  return {
    dialogApplyProcessOpen,
    handleCloseDrawerAddProcess,
    handleOpenDrawerAddProcess,
    editItem,
    handleEditeProcessWithDrawer,
  }
}
