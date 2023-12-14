import React from "react"
import { ProcessFormListData } from "@/app/ebs-profession/ebs-data/types"

export default function useDrawerAddProcessForm() {
  const [drawerAddFormOpen, setDrawerAddFormOpen] = React.useState(false)
  const [formItem, setFormItem] = React.useState<ProcessFormListData | null>(null)

  const handleCloseDrawerAddForm = () => {
    setDrawerAddFormOpen(false)
    setFormItem(null)
  }
  const handleOpenDrawerAddForm = () => {
    setDrawerAddFormOpen(true)
  }

  const handleEditeProcessFormWithDrawer = (item: ProcessFormListData) => {
    setFormItem(item)
    setDrawerAddFormOpen(true)
  }

  return {
    drawerAddFormOpen,
    handleCloseDrawerAddForm,
    handleOpenDrawerAddForm,
    formItem,
    handleEditeProcessFormWithDrawer,
  }
}
