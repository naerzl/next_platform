import React from "react"
import {
  Button,
  DialogActions,
  Drawer,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
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
  } = useForm<IForm>({})

  const { trigger: postProcessApi } = useSWRMutation("/process", reqPostProcess)

  const { trigger: putProcessApi } = useSWRMutation("/process", reqPutProcess)

  const handleSetFormValue = (item: ProcessListData) => {
    setValue("name", item.name)
    setValue("desc", item.desc)
    setValue("percentage", item.percentage)
    setStage(item.stage)
  }

  React.useEffect(() => {
    if (Boolean(editItem)) {
      handleSetFormValue(editItem as ProcessListData)
    }
  }, [editItem])

  const { run: onSubmit }: { run: SubmitHandler<IForm> } = useDebounce(async (values: IForm) => {
    if (Boolean(editItem)) {
      let params = { stage: stage } as TypeApiPutProcessParams
      params.id = editItem!.id

      await putProcessApi(Object.assign(params, values))

      cb(Object.assign(params), false)
    } else {
      let params = { stage: stage } as TypeApiPostProcessParams
      params.ebs_id = item.id

      const res = await postProcessApi(Object.assign(params, values))
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
    getRoleApi({ class: "normal" }).then((roleRes) => {
      roleRes &&
        setRoleOption(roleRes.map((item) => ({ ...item, label: item.name, value: item.flag })))
    })
  }

  React.useEffect(() => {
    open && getRoleAndSection()
  }, [open])

  const [stage, setStage] = React.useState<number>(2)
  const handleRoleSelect = (event: SelectChangeEvent<number>) => {
    const {
      target: { value },
    } = event
    setStage(+value)
  }

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
                  {...register("name", { required: "请输入名称" })}
                  placeholder="请输入名称"
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
                <InputLabel htmlFor="percentage" className="mr-3 w-20 text-left mb-2.5">
                  工作量:
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="percentage"
                  size="small"
                  fullWidth
                  error={Boolean(errors.percentage)}
                  {...register("percentage", { required: "请输入工作量" })}
                  placeholder="请输入工作量"
                />
                {/*<Select*/}
                {/*  value={roleSelectState}*/}
                {/*  onChange={handleRoleSelect}*/}
                {/*  MenuProps={{ sx: { zIndex: 1602 } }}*/}
                {/*  sx={{ flex: 1, color: "#303133", zIndex: 1602 }}*/}
                {/*  id="role_list"*/}
                {/*  placeholder="请选择关联的角色"*/}
                {/*  size="small"*/}
                {/*  multiple*/}
                {/*  fullWidth>*/}
                {/*  {roleOption.map((item) => (*/}
                {/*    <MenuItem value={item.value} key={item.value}>*/}
                {/*      <ListItemIcon>{item.label}</ListItemIcon>*/}
                {/*    </MenuItem>*/}
                {/*  ))}*/}
                {/*</Select>*/}
              </div>
            </div>

            <div className="mb-8 relative">
              <div className="flex items-start flex-col">
                <InputLabel htmlFor="stage" className="mr-3 w-20 text-left mb-2.5" required>
                  标识:
                </InputLabel>
                <Select
                  value={stage}
                  onChange={handleRoleSelect}
                  MenuProps={{ sx: { zIndex: 1602 } }}
                  sx={{ flex: 1, color: "#303133", zIndex: 1602 }}
                  id="role_list"
                  placeholder="请选择关联的角色"
                  size="small"
                  fullWidth>
                  <MenuItem value={1}>开始</MenuItem>
                  <MenuItem value={2}></MenuItem>
                  <MenuItem value={3}>结束</MenuItem>
                </Select>
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
                <InputLabel htmlFor="desc" className="mr-3 w-20 text-left mb-2.5" required>
                  工序说明:
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="desc"
                  size="small"
                  fullWidth
                  error={Boolean(errors.desc)}
                  {...register("desc", {
                    required: "请输入工序说明",
                  })}
                  placeholder="请输入工序说明"
                  className="flex-1"
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
