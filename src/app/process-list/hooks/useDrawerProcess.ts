import React from "react"
import { ProcessListDataType } from "@/app/process-list/types"

export default function useDrawerProcess() {
  const [drawerProcessOpen, setDrawerProcessOpen] = React.useState(false)
  const [editItem, setEditItem] = React.useState<ProcessListDataType | null>(null)

  const handleCloseDrawerProcess = () => {
    setDrawerProcessOpen(false)
    setEditItem(null)
  }
  const handleAddDrawerProcess = () => {
    setDrawerProcessOpen(true)
  }

  const handleEditDrawerProcess = (item: ProcessListDataType) => {
    setDrawerProcessOpen(true)
    setEditItem(item)
  }

  return {
    drawerProcessOpen,
    handleAddDrawerProcess,
    handleCloseDrawerProcess,
    editItem,
    handleEditDrawerProcess,
  }
}
