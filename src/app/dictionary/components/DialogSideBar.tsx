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
import { useForm, SubmitHandler } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import { reqPostDictionaryClass, reqPutDictionaryClass } from "../api"
import message from "antd-message-react"
import {
  DictionaryClassData,
  ReqAddDictionaryClassParams,
  ReqPutDictionaryClassParams,
} from "../types"
import { iconList } from "./IconEnum"
import SideContext from "../context/sideContext"

interface Props {
  open: boolean
  close: () => void
  parent_id?: number | undefined
  // eslint-disable-next-line no-unused-vars
  getSubClassList?: (id: number) => void
  // eslint-disable-next-line no-unused-vars
  cb: (id: number, isEdit?: boolean) => void
  editItem: undefined | DictionaryClassData
  setEditItem: React.Dispatch<React.SetStateAction<DictionaryClassData | undefined>>
}

interface IForm {
  name: string
  icon: string
}

function DialogSideBar(props: Props) {
  const ctx = React.useContext(SideContext)
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
    "/dictionary-class",
    reqPostDictionaryClass,
  )

  const { trigger: putCollectionClassApi } = useSWRMutation(
    "/dictionary-class",
    reqPutDictionaryClass,
  )

  // 表单提交事件
  const { run: onSubmit }: { run: SubmitHandler<IForm> } = useDebounce(async (values: IForm) => {
    const obj: ReqAddDictionaryClassParams = {
      ...values,
      relationship: parent_id ? [parent_id] : ([] as any),
      serial: 1,
    }
    // 拼接出请求需要的参数
    if (editItem) {
      await putCollectionClassApi({ ...obj, id: editItem.id } as ReqPutDictionaryClassParams)
    } else {
      await postCollectionClassApi(parent_id ? { ...obj, parent_id } : obj)
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
