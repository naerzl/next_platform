import React from "react"
import {
  Autocomplete,
  Button,
  Chip,
  DialogActions,
  Drawer,
  InputLabel,
  TextField,
} from "@mui/material"
import { ErrorMessage } from "@hookform/error-message"
import { SubmitHandler, useForm } from "react-hook-form"
import useDebounce from "@/hooks/useDebounce"
import { RolesListData } from "@/app/member-department/types"
import useSWRMutation from "swr/mutation"
import { reqGetRole } from "@/app/member-department/api"
import { reqPostProcess, reqPutProcess } from "@/app/ebs-profession/ebs-data/api"
import {
  ProcessListData,
  TypeApiPostProcessParams,
  TypeApiPutProcessParams,
  TypeEBSDataList,
} from "@/app/ebs-profession/ebs-data/types"

type Props = {
  open: boolean
  handleCloseDrawerAddProcess: () => void
  item: TypeEBSDataList
  // eslint-disable-next-line no-unused-vars
  cb: (item: ProcessListData, isAdd: boolean) => void
  editItem: ProcessListData | null
}

type IForm = {
  name: string
  desc: string
  percentage: number
  stage: string
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

export default function AddProcess(props: Props) {
  const { open, handleCloseDrawerAddProcess, item, cb, editItem } = props
  const handleClose = () => {
    handleCloseDrawerAddProcess()
  }

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    trigger,
  } = useForm<IForm>({})

  const { trigger: postProcessApi } = useSWRMutation("/process", reqPostProcess)

  const { trigger: putProcessApi } = useSWRMutation("/process", reqPutProcess)

  const handleSetFormValue = (item: ProcessListData) => {
    setValue("name", item.name)
    setValue("desc", item.desc)
    setValue("percentage", item.percentage)
    const obj = stageOption.find((i) => i.value == item.stage)
    setStage(obj ? obj.label : "")
  }

  React.useEffect(() => {
    if (Boolean(editItem)) {
      handleSetFormValue(editItem as ProcessListData)
    }
  }, [editItem])

  const { run: onSubmit }: { run: SubmitHandler<IForm> } = useDebounce(async (values: IForm) => {
    if (Boolean(editItem)) {
      let params = {
        stage: stageOption.find((i) => i.label == stage)?.value,
        percentage: values.percentage,
        name: values.name,
        desc: values.desc,
      } as TypeApiPutProcessParams
      params.id = editItem!.id

      await putProcessApi(params)

      cb(Object.assign(params), false)
    } else {
      let params = {
        stage: stageOption.find((i) => i.label == stage)?.value,
        percentage: values.percentage,
        name: values.name,
        desc: values.desc,
      } as TypeApiPostProcessParams
      params.ebs_id = item.id

      const res = await postProcessApi(params)
      const newRes = structuredClone(res)

      cb(Object.assign(newRes, params, values), true)
    }
    handleClose()
  })

  const { trigger: getRoleApi } = useSWRMutation("/role", reqGetRole)

  // 角色下拉框选项
  const [roleOption, setRoleOption] = React.useState<
    (RolesListData & { label: string; value: string })[]
  >([])

  const getRoleAndSection = async () => {
    getRoleApi({ class: "normal", is_client: 1 }).then((roleRes) => {
      roleRes &&
        setRoleOption(roleRes.map((item) => ({ ...item, label: item.name, value: item.flag })))
    })
  }

  React.useEffect(() => {
    open && getRoleAndSection()
  }, [open])

  const [stage, setStage] = React.useState<string | null>(null)

  return (
    <>
      <Drawer open={open} onClose={handleClose} anchor="right" sx={{ zIndex: 1601 }}>
        <div className="w-[500px] p-10">
          <header className="text-3xl text-[#44566C] mb-8">
            {Boolean(editItem) ? "修改工序" : "添加工序"}
          </header>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-8 relative">
              <div className="flex items-start flex-col">
                <InputLabel htmlFor="name" className="mr-3 w-20 text-left mb-2.5" required>
                  名称:
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

            <div className="mb-8">
              <div className="flex items-start flex-col">
                <InputLabel htmlFor="percentage" className="mr-3 w-20 text-left mb-2.5" required>
                  工作量%:
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="percentage"
                  size="small"
                  fullWidth
                  type="number"
                  error={Boolean(errors.percentage)}
                  {...register("percentage", {
                    required: "请输入工作量%",
                    max: {
                      value: 100,
                      message: "最大值为100",
                    },
                    min: {
                      value: 0,
                      message: "最小值为0",
                    },
                    onBlur() {
                      trigger("percentage")
                    },
                  })}
                  placeholder="请输入工作量"
                  autoComplete="off"
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="percentage"
                render={({ message }) => (
                  <p className="text-railway_error text-sm absolute">{message}</p>
                )}
              />
            </div>

            <div className="mb-8 relative">
              <div className="flex items-start flex-col">
                <InputLabel htmlFor="stage" className="mr-3 w-20 text-left mb-2.5">
                  标识:
                </InputLabel>

                <Autocomplete
                  disablePortal
                  id="h_subpart_code"
                  options={stageOption.map((item) => item?.label)}
                  fullWidth
                  value={stage}
                  size="small"
                  onChange={(event, value, reason, details) => {
                    setStage(value)
                  }}
                  renderInput={(params) => <TextField {...params} label="请选择标识" />}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option}>
                        {option}
                      </li>
                    )
                  }}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip {...getTagProps({ index })} key={option} label={option} />
                    ))
                  }}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="desc"
                render={({ message }) => (
                  <p className="text-railway_error text-sm absolute">{message}</p>
                )}
              />
            </div>

            <div className="mb-8 relative">
              <div className="flex items-start flex-col">
                <InputLabel htmlFor="desc" className="mr-3 w-20 text-left mb-2.5">
                  工序说明:
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="desc"
                  size="small"
                  fullWidth
                  error={Boolean(errors.desc)}
                  {...register("desc")}
                  placeholder="请输入工序说明"
                  className="flex-1"
                  autoComplete="off"
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="desc"
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
    </>
  )
}
