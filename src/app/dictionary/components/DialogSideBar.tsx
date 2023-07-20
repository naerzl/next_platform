"use client"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  TextField,
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
import { useForm, SubmitHandler } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"

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

  // 表单控制hooks
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IForm>()

  // 表单提交事件
  const { run: onSubmit }: { run: SubmitHandler<IForm> } = useDebounce((values: IForm) => {
    // 拼接出请求需要的参数
    const obj: ReqAddDictionaryClassParams = {
      ...values,
      relationship: parent_id ? [parent_id] : [],
      serial: 1,
      parent_id: parent_id || null,
    }
    apiTrigger(obj).then((res) => {
      if (res.code !== STATUS_SUCCESS) return message.error("操作失败")
      message.success("操作成功")
      // 重新获取侧边分类
      ctx.changeSideBarList()
      // 如果有父类id则获取子集分类
      parent_id && getSubClassList(parent_id as number)
      handleClose()
    })
  })

  // 关闭弹窗
  const handleClose = () => {
    close()
    reset()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>添加目录项</DialogTitle>
      <DialogContent sx={{ width: 500 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <div className="flex items-center">
              <InputLabel htmlFor="name" className="mr-3 w-20 text-right inline-block">
                字典名称:
              </InputLabel>
              <TextField
                id="name"
                error={Boolean(errors.name)}
                variant="outlined"
                placeholder="请输入字典名称"
                className="flex-1"
                {...register("name", { required: "请输入字典名称" })}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="name"
              render={({ message }) => (
                <p className="text-railway_error text-sm pl-24">{message}</p>
              )}
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center">
              <InputLabel htmlFor="icon" className="mr-3 w-20 text-right">
                icon:
              </InputLabel>
              <Select
                error={Boolean(errors.icon)}
                sx={{ flex: 1 }}
                id="icon"
                placeholder="请选择一个图标"
                defaultValue={"FolderOpenSharpIcon"}
                {...register("icon", { required: "请选择一个图标" })}>
                {iconList.map((icon) => (
                  <MenuItem value={icon.name} key={icon.name}>
                    <ListItemIcon>{icon.component}</ListItemIcon>
                  </MenuItem>
                ))}
              </Select>
            </div>
            <ErrorMessage
              errors={errors}
              name="icon"
              render={({ message }) => (
                <p className="text-railway_error text-sm pl-24">{message}</p>
              )}
            />
          </div>
          <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button type="submit">确定</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogSideBar
