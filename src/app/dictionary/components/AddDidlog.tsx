"use client"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputBase,
  InputLabel,
} from "@mui/material"
import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import useDebounce from "@/hooks/useDebounce"
import useSWRMutation from "swr/mutation"
import { reqPostAddDictionary } from "../api"
import { STATUS_SUCCESS } from "@/libs/const"
import message from "antd-message-react"
import { GetDictionaryDataOption } from "../page"

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
  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      name: "", // 字典名换成呢个
      serial: "", // 字典序号
    },
  })

  const { run: onSubmit }: { run: SubmitHandler<IForm> } = useDebounce((values: IForm) => {
    apiTrigger({ ...values, class_id }).then((res) => {
      if (res.code !== STATUS_SUCCESS) return message.error(res.msg)
      message.success("操作成功")
      getDictionaryData({ class_id })
      close()
      reset()
    })
  })
  const handleClose = () => {
    close()
  }
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>新增字典</DialogTitle>
      <DialogContent sx={{ width: 500 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center mb-4">
            <InputLabel htmlFor="name" className="mr-3 w-20 text-right">
              字典名称:
            </InputLabel>
            <InputBase
              id="name"
              {...register("name")}
              margin="dense"
              placeholder="请输入字典名称"
              className="flex-1 border p-1"
            />
          </div>

          <div className="flex items-center mb-4">
            <InputLabel htmlFor="serial" className="mr-3 w-20 text-right">
              排序:
            </InputLabel>
            <InputBase
              id="serial"
              {...register("serial")}
              margin="dense"
              placeholder="请输入字典排序值"
              className="flex-1 border p-1"
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
