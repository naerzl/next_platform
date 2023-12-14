import React from "react"
import {
  Button,
  DialogActions,
  Drawer,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Tooltip,
} from "@mui/material"
import { ErrorMessage } from "@hookform/error-message"
import { SubmitHandler, useForm } from "react-hook-form"
import useDebounce from "@/hooks/useDebounce"
import useSWRMutation from "swr/mutation"
import {
  ProcessListDataType,
  TagsListDataType,
  TypeApiPostProcessParams,
  TypeApiPutProcessParams,
} from "@/app/process-list/types"
import { RequireTag } from "@/libs/other"
import {
  reqGetTagsList,
  reqPostProcess,
  reqPostTagsList,
  reqPutProcess,
} from "@/app/process-list/api"
import Autocomplete from "@mui/material/Autocomplete"
import AddIcon from "@mui/icons-material/Add"
import IconButton from "@mui/material/IconButton"
import CheckIcon from "@mui/icons-material/Check"
import ClearIcon from "@mui/icons-material/Clear"
import { message } from "antd"
type Props = {
  open: boolean
  handleCloseDrawerAddProcess: () => void
  // item: TypeEBSDataList
  // eslint-disable-next-line no-unused-vars
  cb: (item: ProcessListDataType, isAdd: boolean) => void
  editItem: ProcessListDataType | null
}

type IForm = {
  name: string
  desc: string
  serial: number
  tags: string
}

const stageOption = [
  {
    label: "开始",
    value: 1,
  },
  {
    label: "结束",
    value: 3,
  },
]

export default function AddOrEditProcess(props: Props) {
  const { open, handleCloseDrawerAddProcess, cb, editItem } = props
  const handleClose = () => {
    handleCloseDrawerAddProcess()
  }

  const { trigger: getTagsListApi } = useSWRMutation("/tag", reqGetTagsList)

  const { trigger: postTagsListApi } = useSWRMutation("/tag", reqPostTagsList)

  const [tagsList, setTagsList] = React.useState<TagsListDataType[]>([])
  const getTagsListData = async () => {
    const res = await getTagsListApi({})
    setTagsList(res)
  }

  React.useEffect(() => {
    getTagsListData()
  }, [])

  const D_selectInputName = React.useRef<HTMLInputElement | null>(null)
  const D_selectInputFlag = React.useRef<HTMLInputElement | null>(null)

  const [tagsState, setTagsState] = React.useState<string[]>([])

  const [showSelectInput, setShowSelectInput] = React.useState(false)

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    trigger,
  } = useForm<IForm>({})

  const { trigger: postProcessApi } = useSWRMutation("/process", reqPostProcess)

  const { trigger: putProcessApi } = useSWRMutation("/process", reqPutProcess)

  const handleSetFormValue = (item: ProcessListDataType) => {
    setValue("name", item.name)
    setValue("desc", item.desc)
    setValue("serial", item.serial)
    console.log(item)
    if (item.tags) {
      setTagsState(item.tags)
    }
  }

  React.useEffect(() => {
    if (Boolean(editItem)) {
      handleSetFormValue(editItem as ProcessListDataType)
    }
  }, [editItem])

  const { run: onSubmit }: { run: SubmitHandler<IForm> } = useDebounce(async (values: IForm) => {
    if (tagsState.length <= 0) return message.warning("请选择工序标签")
    let params = {
      name: values.name,
      desc: values.desc,
      serial: values.serial,
      tags: JSON.stringify(tagsState),
    } as TypeApiPutProcessParams & TypeApiPostProcessParams

    if (Boolean(editItem)) {
      params.id = editItem!.id
      await putProcessApi(params)

      cb(Object.assign(params), false)
    } else {
      const res = await postProcessApi(params)
      const newRes = structuredClone(res)

      cb(Object.assign(newRes, params, values), true)
    }
    handleClose()
  })

  const handleClickSaveSelectInput = async () => {
    if (D_selectInputName.current && D_selectInputFlag.current) {
      if (D_selectInputName.current!.value == "" || D_selectInputFlag.current!.value == "") return
      let params = {
        name: D_selectInputName.current!.value,
        flag: D_selectInputFlag.current!.value,
      }
      const res = await postTagsListApi(params)
      const TagItem = { id: res.id, ...params } as TagsListDataType
      setTagsList((prevState) => [...prevState, TagItem])
      setTagsState((prevState) => [...prevState, params.flag])
      setShowSelectInput(false)
      D_selectInputName.current!.value = ""
      D_selectInputFlag.current!.value = ""
    }
  }

  return (
    <>
      <Drawer open={open} onClose={handleClose} anchor="right" sx={{ zIndex: 1601 }}>
        <div className="w-[500px] p-10">
          <header className="text-3xl text-[#44566C] mb-8">
            {Boolean(editItem) ? "修改工序" : "添加工序"}
          </header>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-8">
              <div className="flex items-start flex-col">
                <InputLabel htmlFor="percentage" className="mr-3 text-left mb-2.5">
                  <RequireTag>序号:</RequireTag>
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="percentage"
                  size="small"
                  fullWidth
                  type="number"
                  error={Boolean(errors.serial)}
                  {...register("serial", {
                    required: "请输入序号",
                    max: {
                      value: 100,
                      message: "最大值为100",
                    },
                    min: {
                      value: 0,
                      message: "最小值为0",
                    },
                    onBlur() {
                      trigger("serial")
                    },
                  })}
                  placeholder="请输入序号"
                  autoComplete="off"
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="serial"
                render={({ message }) => (
                  <p className="text-railway_error text-sm absolute">{message}</p>
                )}
              />
            </div>

            <div className="mb-8 relative">
              <div className="flex items-start flex-col">
                <InputLabel htmlFor="name" className="mr-3  text-left mb-2.5">
                  <RequireTag>工序名称:</RequireTag>
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="name"
                  size="small"
                  fullWidth
                  error={Boolean(errors.name)}
                  {...register("name", {
                    required: "请输入名称",
                    maxLength: {
                      value: 16,
                      message: "文本字数最多16个",
                    },
                    onBlur() {
                      trigger("name")
                    },
                  })}
                  placeholder="请输入名称"
                  autoComplete="off"
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
                <InputLabel htmlFor="name" className="mr-3  text-left mb-2.5">
                  <RequireTag>
                    <>
                      <span>工序标签：</span>
                      <Tooltip
                        title="工序标签可输入多个，请用、隔开"
                        sx={{ zIndex: 99999 }}
                        placement="top">
                        <i className="iconfont icon-wenhao-xianxingyuankuang cursor-pointer"></i>
                      </Tooltip>
                    </>
                  </RequireTag>
                </InputLabel>
                <Select
                  id="tags"
                  fullWidth
                  multiple
                  value={tagsState}
                  size="small"
                  MenuProps={{ sx: { zIndex: 1703 } }}
                  onChange={(event, child) => {
                    setTagsState((event.target.value as string[]).filter((e) => e))
                  }}>
                  <MenuItem value={"null"} disabled>
                    <i className="text-railway_gray">请选择一个标识</i>
                  </MenuItem>
                  {tagsList.map((tag) => (
                    <MenuItem key={tag.flag} value={tag.flag}>
                      {tag.name}
                    </MenuItem>
                  ))}
                  <div className="pl-3">
                    {showSelectInput ? (
                      <div className="w-full flex gap-x-1">
                        <input
                          placeholder="标识名称"
                          className="border outline-railway_blue w-40 indent-1"
                          ref={D_selectInputName}
                        />
                        <input
                          placeholder="标识"
                          className="border outline-railway_blue w-40 indent-1"
                          ref={D_selectInputFlag}
                        />
                        <IconButton
                          onClick={() => {
                            handleClickSaveSelectInput()
                          }}>
                          <CheckIcon className="text-[#4db0e4]" />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            if (D_selectInputName.current && D_selectInputFlag.current) {
                              D_selectInputName.current.value = ""
                              D_selectInputFlag.current.value = ""
                            }
                            setShowSelectInput(false)
                          }}>
                          <ClearIcon className="text-[#e77364]" />
                        </IconButton>
                      </div>
                    ) : (
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => {
                          setShowSelectInput(true)
                        }}>
                        添加标签
                      </Button>
                    )}
                  </div>
                </Select>
                {/*<Autocomplete*/}
                {/*  multiple*/}
                {/*  fullWidth*/}
                {/*  size="small"*/}
                {/*  freeSolo*/}
                {/*  id="free-solo-2-demo"*/}
                {/*  disableClearable*/}
                {/*  options={tagsList.map((option) => option.flag)}*/}
                {/*  renderInput={(params) => (*/}
                {/*    <TextField*/}
                {/*      {...params}*/}
                {/*      placeholder="请输入标签"*/}
                {/*      InputProps={{*/}
                {/*        ...params.InputProps,*/}
                {/*        type: "search",*/}
                {/*      }}*/}
                {/*    />*/}
                {/*  )}*/}
                {/*  onChange={(event, value, reason, details) => {*/}
                {/*    console.log(value)*/}
                {/*  }}*/}
                {/*  onInputChange={(event, value, reason) => {*/}
                {/*    console.log(value)*/}
                {/*    setTagsInputState(value)*/}
                {/*  }}*/}
                {/*/>*/}
              </div>
              <ErrorMessage
                errors={errors}
                name="tags"
                render={({ message }) => (
                  <p className="text-railway_error text-sm absolute">{message}</p>
                )}
              />
            </div>

            <div className="mb-8 relative">
              <div className="flex items-start flex-col">
                <InputLabel htmlFor="desc" className="mr-3 w-20 text-left mb-2.5">
                  说明:
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="desc"
                  size="small"
                  fullWidth
                  error={Boolean(errors.desc)}
                  {...register("desc")}
                  placeholder="请输入说明"
                  className="flex-1"
                  autoComplete="off"
                />
              </div>
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
    </>
  )
}
