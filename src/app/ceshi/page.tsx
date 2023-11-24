"use client"

import React from "react"
import { useConfirmationDialog } from "@/components/ConfirmationDialogProvider"

function Page() {
  const { showConfirmationDialog } = useConfirmationDialog()

  const handleDelete = () => {
    showConfirmationDialog("确认要删除吗？", () => {
      console.log("删除")
    })
  }

  return (
    <div>
      <button
        onClick={() => {
          handleDelete()
        }}>
        弹窗按钮
      </button>
    </div>
  )
}

export default Page
