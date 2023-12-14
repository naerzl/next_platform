import React from "react"
import { ProcessListDataType } from "@/app/process-list/types"

export default function useDialogProcessForm() {
  const [dialogAddFormOpen, setDialogAddFormOpen] = React.useState(false)
  const [formItem, setFormItem] = React.useState<ProcessListDataType>({} as ProcessListDataType)

  const handleCloseDialogAddForm = () => {
    setDialogAddFormOpen(false)
    setFormItem({} as ProcessListDataType)
  }
  const handleOpenDialogAddForm = (item: ProcessListDataType) => {
    setDialogAddFormOpen(true)
    setFormItem(item)
  }

  return {
    dialogAddFormOpen,
    handleCloseDialogAddForm,
    handleOpenDialogAddForm,
    formItem,
  }
}
