"use client"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputBase,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
} from "@mui/material"
import React from "react"
import useDebounce from "@/hooks/useDebounce"
import useSWRMutation from "swr/mutation"
import { reqPostDictionaryClass } from "../api"
import { ReqAddDictionaryClassParams } from "../types"
import message from "antd-message-react"
import { STATUS_SUCCESS } from "@/libs/const"
import { iconList } from "./icon"
import SideContext from "../context/sideContext"

interface Props {
  open: boolean
  close: () => void
  parent_id?: number | undefined
  // eslint-disable-next-line no-unused-vars
  getSubClassList: (id: number) => void
}

interface IForm {
  name: string
  icon: string
}

function DialogSideBar(props: Props) {
  const { open, close, parent_id, getSubClassList } = props
  const ctx = React.useContext(SideContext)
  const { trigger: apiTrigger } = useSWRMutation("/dictionary-class", reqPostDictionaryClass)
  const [formData, setFormData] = React.useState<IForm>({
    icon: "",
    name: "",
  })

  const { run: onSubmit } = useDebounce(() => {
    console.log(formData)
    if (formData.icon === "" || formData.name === "") return message.error("请将数据填写完整")
    const obj: ReqAddDictionaryClassParams = {
      ...formData,
      relationship: parent_id ? [parent_id] : [],
      serial: 1,
      parent_id: parent_id || null,
    }
    apiTrigger(obj).then((res) => {
      if (res.code !== STATUS_SUCCESS) return message.error("操作失败")
      message.success("操作成功")
      ctx.changeSideBarList()
      parent_id && getSubClassList(parent_id as number)
      handleClose()
    })
  })

  const handleClose = () => {
    close()
    setFormData({
      icon: "",
      name: "",
    })
  }

  const handleChange = (type: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((pre) => ({ ...pre, [type]: e.target.value }))
  }
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>添加目录项</DialogTitle>
      <DialogContent sx={{ width: 500 }}>
        <div className="flex items-center mb-4">
          <InputLabel htmlFor="name" className="mr-3 w-20 text-right inline-block">
            字典名称:
          </InputLabel>
          <InputBase
            id="name"
            margin="dense"
            placeholder="请输入字典名称"
            className="flex-1 border p-1 block h-14 py-3"
            value={formData.name}
            onChange={(e: any) => handleChange("name", e)}
          />
        </div>
        <div className="flex items-center mb-4">
          <InputLabel htmlFor="icon" className="mr-3 w-20 text-right">
            icon:
          </InputLabel>
          <Select
            sx={{ flex: 1 }}
            id="icon"
            placeholder="请选择图标"
            value={formData.icon}
            onChange={(e: any) => handleChange("icon", e)}>
            {iconList.map((icon) => (
              <MenuItem value={icon.name} key={icon.name}>
                <ListItemIcon>{icon.component}</ListItemIcon>
              </MenuItem>
            ))}
          </Select>
        </div>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={() => onSubmit()}>确定</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default DialogSideBar
