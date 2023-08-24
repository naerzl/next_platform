"use client"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputLabel,
} from "@mui/material"
import React from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import useDebounce from "@/hooks/useDebounce"
import useSWRMutation from "swr/mutation"
import { reqPostAddDictionary } from "../api"
import { message } from "antd"
import { GetDictionaryDataOption } from "./Main"
import { ErrorMessage } from "@hookform/error-message"

interface Props {
  open: boolean
  close: () => void
  // eslint-disable-next-line no-unused-vars
  getDictionaryData: (option: GetDictionaryDataOption) => void
  class_id: number
}

interface IForm {
  name: string
  serial: string
}

function AddDidlog(props: Props) {
  const { open, close, getDictionaryData, class_id } = props
  const { trigger: apiTrigger } = useSWRMutation("/dictionary", reqPostAddDictionary)
  // 表单控制hooks
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "", // 字典名换成呢个
      serial: "", // 字典序号
    },
  })

  const { run: onSubmit }: { run: SubmitHandler<IForm> } = useDebounce((values: IForm) => {
    apiTrigger({ ...values, class_id }).then(() => {
      message.success("操作成功")
      getDictionaryData({ class_id })
      handleClose()
    })
  })

  // 关闭弹窗 重置表单数据
  const handleClose = () => {
    close()
    reset()
  }
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>新增字典</DialogTitle>
      <DialogContent sx={{ width: 500 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <div className="flex items-center">
              <InputLabel htmlFor="name" className="mr-3 w-20 text-right">
                字典名称:
              </InputLabel>
              <TextField
                variant="outlined"
                id="name"
                error={Boolean(errors.name)}
                {...register("name", { required: "请输入字典名称" })}
                margin="dense"
                placeholder="请输入字典名称"
                className="flex-1"
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
              <InputLabel htmlFor="serial" className="mr-3 w-20 text-right">
                排序:
              </InputLabel>
              <TextField
                variant="outlined"
                id="serial"
                error={Boolean(errors.serial)}
                {...register("serial", { required: "请输入字典的排序值" })}
                margin="dense"
                placeholder="请输入字典排序值"
                className="flex-1"
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="serial"
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

export default AddDidlog
