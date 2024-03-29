"use client"
import {
  Button,
  DialogActions,
  Drawer,
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
import { reqGetDictionaryClass, reqPostDictionaryClass, reqPutDictionaryClass } from "../api"
import { message } from "antd"
import {
  DictionaryClassData,
  ReqAddDictionaryClassParams,
  ReqGetDictionaryClassParams,
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
  level: number
}

interface IForm {
  name: string
  icon: string
}

const findTitle = (level: number) => {
  switch (level) {
    case 1:
      return "一级分类"
    case 2:
      return "二级分类"
    case 3:
      return "三级分类"
    default:
      return ""
  }
}

export default function dialogSideBar(props: Props) {
  const ctx = React.useContext(SideContext)
  const { open, close, parent_id, cb, editItem, setEditItem, level } = props

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

  const { trigger: getCollectionClassApi } = useSWRMutation(
    "/dictionary-class",
    reqGetDictionaryClass,
  )

  const { trigger: putCollectionClassApi } = useSWRMutation(
    "/dictionary-class",
    reqPutDictionaryClass,
  )

  const [collectionClassList, setCollectionClassList] = React.useState<DictionaryClassData[]>([])
  const getCollectionClassListData = async () => {
    const params = {} as ReqGetDictionaryClassParams
    if (parent_id) params.parent_id = parent_id
    const res = await getCollectionClassApi(params)
    setCollectionClassList(res)
  }

  React.useEffect(() => {
    getCollectionClassListData()
  }, [parent_id])

  // 表单提交事件
  const { run: onSubmit }: { run: SubmitHandler<IForm> } = useDebounce(async (values: IForm) => {
    const obj: ReqAddDictionaryClassParams = {
      ...values,
      relationship: parent_id ? [parent_id] : ([] as any),
      serial: 1,
    }
    // 拼接出请求需要的参数
    if (editItem) {
      const item = collectionClassList.find((item) => item.name == values.name)
      if (editItem.name != values.name && item) return message.error("该字典已存在，确认修改？")
      await putCollectionClassApi({ ...obj, id: editItem.id } as ReqPutDictionaryClassParams)
    } else {
      const item = collectionClassList.find((item) => item.name == values.name)
      if (item) return message.error("该字典已存在，确认添加？")
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
    <Drawer open={open} onClose={handleClose} anchor="right">
      <div className="w-[500px] p-10">
        <header className="text-3xl text-[#44566C] mb-8">
          {Boolean(editItem) ? `修改${findTitle(level)}` : `添加${findTitle(level)}`}
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel htmlFor="name" className="mr-3 mb-2.5 text-left inline-block">
                {findTitle(level)}名称*:
              </InputLabel>
              <TextField
                id="name"
                fullWidth
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
                <p className="text-railway_error text-sm absolute">{message}</p>
              )}
            />
          </div>
          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel htmlFor="icon" className="mr-3 mb-2.5 w-24 text-left inline-block">
                选择图标*:
              </InputLabel>
              <Select
                error={Boolean(errors.icon)}
                sx={{ flex: 1 }}
                id="icon"
                fullWidth
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
