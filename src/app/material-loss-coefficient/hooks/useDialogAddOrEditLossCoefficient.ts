import React from "react"

const useDialogAddOrEditLossCoefficient = () => {
  const [open, setOpen] = React.useState(false)

  const handleAddLossCoefficient = () => {
    setOpen(true)
  }

  const handleCloseDialogLossCoefficient = () => {
    setOpen(false)
  }
  return {
    open,
    handleAddLossCoefficient,
    handleCloseDialogLossCoefficient,
  }
}

export default useDialogAddOrEditLossCoefficient
