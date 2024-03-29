"use client"
import React, { CSSProperties } from "react"
import GppGoodIcon from "@mui/icons-material/GppGood"

type ConfirmationDialogProps = {
  text: string
  onConfirm: () => void
  onCancel: () => void
  content?: React.ReactNode
  cancelBtnStyle?: CSSProperties
  confirmBtnStyle?: CSSProperties
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (props, context) => {
  const { text, onConfirm, onCancel, cancelBtnStyle, confirmBtnStyle, content } = props
  return (
    <div
      className="confirmation-dialog fixed z-[99999] w-full h-full"
      style={{ backgroundColor: "rgba(0,0,0,.4)" }}>
      <div className="confirmation-dialog-content w-100 h-72 bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div style={{ height: "calc(100% - 3.5rem)" }}>
          {content ? (
            content
          ) : (
            <>
              <div className="h-14 mt-14 mb-7 text-center">
                <GppGoodIcon sx={{ color: "#09b66d", fontSize: "4.5rem" }} />
              </div>
              <div className="text-center mb-[4.25rem]">{text}</div>
            </>
          )}
          <div className="confirmation-dialog-buttons h-14 bg-[#f8fafb] flex">
            <button onClick={onCancel} className="flex-1" style={cancelBtnStyle}>
              取消
            </button>
            <button onClick={onConfirm} className="flex-1" style={confirmBtnStyle}>
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDialog
