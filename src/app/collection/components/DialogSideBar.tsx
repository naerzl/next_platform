"use client"
import { Button, DialogActions, InputLabel, TextField, Drawer } from "@mui/material"
import React from "react"
import useDebounce from "@/hooks/useDebounce"
import useSWRMutation from "swr/mutation"
import { useForm, SubmitHandler } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import { reqPostCollectionClass, reqPutCollectionClass } from "../api"
import CollectionContext from "../context/collectionContext"
import { message } from "antd"
import { ReqGetAddCollectionClassResponse } from "../types"

interface Props {
  open: boolean
  close: () => void
  parent_id?: number | undefined
  // eslint-disable-next-line no-unused-vars
  getSubClassList?: (id: number) => void
  // eslint-disable-next-line no-unused-vars
  cb: (id: number, isEdit?: boolean) => void
  editItem: undefined | ReqGetAddCollectionClassResponse
  setEditItem: React.Dispatch<React.SetStateAction<ReqGetAddCollectionClassResponse | undefined>>
}

interface IForm {
  name: string
}

export default function dialogSideBar(props: Props) {
  const ctx = React.useContext(CollectionContext)
  const { open, close, parent_id, cb, editItem, setEditItem } = props

  // 表单控制hooks
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IForm>({})

  React.useEffect(() => {
    setValue("name", editItem ? editItem.name : "")
  }, [editItem])

  const { trigger: postCollectionClassApi } = useSWRMutation(
    "/structure-collection-class",
    reqPostCollectionClass,
  )

  const { trigger: putCollectionClassApi } = useSWRMutation(
    "/structure-collection-class",
    reqPutCollectionClass,
  )

  // 表单提交事件
  const { run: onSubmit }: { run: SubmitHandler<IForm> } = useDebounce(async (values: IForm) => {
    // 拼接出请求需要的参数
    if (editItem) {
      await putCollectionClassApi({ ...values, id: editItem.id })
    } else {
      await postCollectionClassApi(parent_id ? { ...values, parent_id } : values)
    }

    message.success("操作成功")
    // 重新获取侧边分类
    ctx.changeSideBarList()
    // 如果有父类id则获取子集分类
    handleClose()
    parent_id && cb(parent_id, editItem ? true : false)
  })

  // 关闭弹窗
  const handleClose = () => {
    close()
    reset()
    setEditItem(undefined)
  }

  return (
    <Drawer open={open} onClose={handleClose} anchor="right">
      <div className="w-[500px] p-10">
        <header className="text-3xl text-[#44566C] mb-8">
          {Boolean(editItem) ? "修改表结构名称" : "添加表结构名称"}
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel htmlFor="name" className="mr-3 mb-2.5 w-24 text-left inline-block">
                表结构名称:
              </InputLabel>
              <TextField
                id="name"
                fullWidth
                error={Boolean(errors.name)}
                variant="outlined"
                placeholder="请输入表结构名称"
                className="flex-1"
                {...register("name", { required: "请输入字典名称" })}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="name"
              render={({ message }) => (
                <p className="text-railway_error text-sm absolute">{message}</p>
              )}
            />
          </div>
          <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button type="submit" variant="contained" className="bg-railway_blue">
              确定
            </Button>
          </DialogActions>
        </form>
      </div>
    </Drawer>
  )
}
