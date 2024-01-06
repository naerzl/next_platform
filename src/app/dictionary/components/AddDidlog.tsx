"use client"
import { Button, DialogActions, TextField, InputLabel, Drawer, IconButton } from "@mui/material"
import React from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import useDebounce from "@/hooks/useDebounce"
import useSWRMutation from "swr/mutation"
import { reqGetDictionary, reqPostAddDictionary, reqPutDictionary } from "../api"
import { message } from "antd"
import { GetDictionaryDataOption } from "./Main"
import { ErrorMessage } from "@hookform/error-message"
import AddIcon from "@mui/icons-material/Add"
import {
  DictionaryData,
  ReqAddDictionaryParams,
  ReqPutDictionaryParams,
} from "@/app/dictionary/types"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"

interface Props {
  open: boolean
  close: () => void
  // eslint-disable-next-line no-unused-vars
  getDictionaryData: (option: GetDictionaryDataOption) => void
  class_id: number
  editItem: null | DictionaryData
}

interface IForm {
  name: string
  serial: number
}

export default function addDidlog(props: Props) {
  const { open, close, getDictionaryData, class_id, editItem } = props

  const { trigger: putDictionaryApi } = useSWRMutation("/dictionary", reqPutDictionary)

  const { trigger: apiTrigger } = useSWRMutation("/dictionary", reqPostAddDictionary)

  const { trigger: getDictionaryApi } = useSWRMutation("/dictionary", reqGetDictionary)

  // 表单控制hooks
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<IForm>()

  React.useEffect(() => {
    console.log("effect")
    if (Boolean(editItem)) {
      setValue("name", editItem!.name)
      if (JSON.parse(editItem!.properties) instanceof Array) {
        setProperty(JSON.parse(editItem!.properties))
      } else {
        setProperty([])
      }
    }
  }, [editItem])

  const dictionaryList = React.useRef<DictionaryData[]>([])
  const getDictionaryList = async () => {
    const res = await getDictionaryApi({ class_id: class_id, page: 1, limit: 100, order: "serial" })
    dictionaryList.current = res.items || []
  }

  React.useEffect(() => {
    getDictionaryList()
  }, [])

  const { run: onSubmit }: { run: SubmitHandler<IForm> } = useDebounce((values: IForm) => {
    let params = {} as ReqAddDictionaryParams | ReqPutDictionaryParams
    params.class_id = class_id
    if (property.length > 0) {
      params.properties = JSON.stringify(property)
      const someValue = property.some((item) => {
        return item.value == "" || item.key == ""
      })
      if (someValue) return message.warning("添加的数据不可为空")
    }

    if (Boolean(editItem)) {
      const item = dictionaryList.current.find((item) => item.name == values.name)
      if (editItem!.name != values.name && item)
        return message.error("修改的字典名称和已有的字典重复")
      putDictionaryApi(
        Object.assign(params, values, { id: editItem!.id }) as ReqPutDictionaryParams,
      ).then(() => {
        message.success("操作成功")
        getDictionaryData({ class_id })
        handleClose()
      })
    } else {
      const item = dictionaryList.current.find((item) => item.name == values.name)
      if (item) return message.error("添加的字典名称和已有的字典重复")

      apiTrigger(Object.assign(params, values)).then(() => {
        message.success("操作成功")
        getDictionaryData({ class_id })
        handleClose()
      })
    }
  })

  // 关闭弹窗 重置表单数据
  const handleClose = () => {
    close()
    reset()
    setProperty([])
  }

  const [property, setProperty] = React.useState<{ key: string; value: string }[]>([])

  const handleChangeKeyAndValueInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    type: "key" | "value",
  ) => {
    const newProperty = structuredClone(property)
    newProperty[index][type] = event.target.value
    setProperty(newProperty)
  }

  const handleDelProperty = (index: number) => {
    const newProperty = structuredClone(property)
    newProperty.splice(index, 1)
    setProperty(newProperty)
  }

  return (
    <Drawer open={open} onClose={handleClose} anchor="right">
      <div className="w-[500px] p-10">
        <header className="text-3xl text-[#44566C] mb-8">
          {Boolean(editItem) ? "编辑字典" : "添加字典"}
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel htmlFor="name" className="mr-3 mb-2.5 w-24 text-left inline-block">
                字典名称*:
              </InputLabel>
              <TextField
                variant="outlined"
                id="name"
                fullWidth
                size="small"
                error={Boolean(errors.name)}
                {...register("name", {
                  required: "请输入字典名称",
                  maxLength: {
                    value: 16,
                    message: "文本字数最多16个",
                  },
                  onBlur() {
                    trigger("name")
                  },
                })}
                placeholder="请输入字典名称"
                className="flex-1"
                autoComplete="off"
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="name"
              render={({ message }) => (
                <p className="text-railway_error text-sm  absolute ">{message}</p>
              )}
            />
          </div>

          <div
            className="bg-railway_blue w-10 h-10 rounded-full flex justify-center items-center shadow cursor-pointer"
            onClick={() => {
              setProperty((prevState) => [...prevState, { value: "", key: "" }])
            }}>
            <AddIcon className="text-[2.15rem] text-white" />
          </div>

          <div className="w-full mb-8">
            {property.map((item, index) => (
              <div key={index} className="w-full flex h-10 gap-2 mt-2.5">
                <div className="flex-1">
                  <TextField
                    variant="outlined"
                    value={item.key}
                    fullWidth
                    size="small"
                    label="属性"
                    onChange={(event) => {
                      handleChangeKeyAndValueInput(event, index, "key")
                    }}
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    variant="outlined"
                    value={item.value}
                    fullWidth
                    size="small"
                    label="数据"
                    onChange={(event) => {
                      handleChangeKeyAndValueInput(event, index, "value")
                    }}
                  />
                </div>
                <IconButton
                  onClick={() => {
                    handleDelProperty(index)
                  }}>
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}
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
