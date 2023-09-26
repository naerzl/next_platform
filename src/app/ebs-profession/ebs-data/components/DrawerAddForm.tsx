import React from "react"
import {
  Autocomplete,
  Button,
  Chip,
  DialogActions,
  Drawer,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
} from "@mui/material"
import {
  ProcessFormListData,
  ProcessListData,
  TypeApiPostProcessFormParams,
  TypeApiPostProcessParams,
  TypeApiPutProcessParams,
} from "@/app/ebs-profession/ebs-data/types"
import { ErrorMessage } from "@hookform/error-message"
import { SubmitHandler, useForm } from "react-hook-form"
import useDebounce from "@/hooks/useDebounce"
import { RolesListData } from "@/app/member-department/types"
import useSWRMutation from "swr/mutation"
import { reqGetRole } from "@/app/member-department/api"
import { reqPostProcessForm, reqPutProcessForm } from "@/app/ebs-profession/ebs-data/api"

type Props = {
  open: boolean
  editItem: ProcessFormListData | null
  handleCloseDrawerAddForm: () => void
  cb: (item: ProcessFormListData, isAdd: boolean) => void
  processItem: ProcessListData
}

type IForm = {
  name: string
  desc: string
}

export default function DrawerAddForm(props: Props) {
  const { open, editItem, handleCloseDrawerAddForm, cb, processItem } = props

  function handleClose() {
    handleCloseDrawerAddForm()
    setSwitchState(0)
    setRoleSelectState([])
    reset()
  }

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    reset,
  } = useForm<IForm>({})

  const { trigger: postProcessForm } = useSWRMutation("/process-form", reqPostProcessForm)
  const { trigger: putProcessForm } = useSWRMutation("/process-form", reqPutProcessForm)

  const { run: onSubmit }: { run: SubmitHandler<IForm> } = useDebounce(async (values: IForm) => {
    if (Boolean(editItem)) {
      const params = {
        id: editItem!.id,
        is_loop: switchState,
        process_id: processItem.id,
      } as TypeApiPostProcessFormParams & { id: number }

      let roles = roleSelectState.map((roleFlag) => {
        const role = roleOption.find((item) => item.label == roleFlag)
        return { flag: role?.flag, name: role?.name }
      })

      let rolesList = roleSelectState.map((roleFlag) => {
        const role = roleOption.find((item) => item.label == roleFlag)
        return { flag: role?.flag, flag_name: role?.name }
      })

      params.role_flags = JSON.stringify(roles)
      await putProcessForm(Object.assign(params, values))
      cb(Object.assign(params, { roles: rolesList } as any), false)
    } else {
      const params = {
        is_loop: switchState,
        process_id: processItem.id,
      } as TypeApiPostProcessFormParams

      let roles = roleSelectState.map((roleFlag) => {
        const role = roleOption.find((item) => item.label == roleFlag)
        return { flag: role?.flag, name: role?.name }
      })

      let rolesList = roleSelectState.map((roleFlag) => {
        const role = roleOption.find((item) => item.label == roleFlag)
        return { flag: role?.flag, flag_name: role?.name }
      })

      params.role_flags = JSON.stringify(roles)
      const res = await postProcessForm(Object.assign(params, values))
      cb(Object.assign(res, params, { roles: rolesList }), true)
    }
    handleClose()
  })

  const [roleSelectState, setRoleSelectState] = React.useState<string[]>([])

  const { trigger: getRoleApi } = useSWRMutation("/role", reqGetRole)

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

  const [switchState, setSwitchState] = React.useState(0)

  const handleSwitchChange = (checked: boolean) => {
    setSwitchState(checked ? 1 : 0)
  }

  React.useEffect(() => {
    if (editItem) {
      setValue("name", editItem.name)
      setValue("desc", editItem.desc)
      setRoleSelectState(editItem.roles.map((item) => item.flag_name))
      setSwitchState(editItem.is_loop)
    }
  }, [editItem])

  return (
    <Drawer open={open} onClose={handleClose} anchor="right" sx={{ zIndex: 1701 }}>
      <div className="w-[500px] p-10">
        <header className="text-3xl text-[#44566C] mb-8">
          {Boolean(editItem) ? "修改表单" : "添加表单"}
        </header>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel htmlFor="name" className="mr-3 w-20 text-left mb-2.5" required>
                表单名称:
              </InputLabel>
              <TextField
                variant="outlined"
                id="name"
                size="small"
                fullWidth
                error={Boolean(errors.name)}
                {...register("name", { required: "请输入名称" })}
                label="请输入名称"
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
              <InputLabel htmlFor="name" className="mr-3 mb-2.5 w-full text-left inline-block">
                <span>(选填)</span>是否可循环：
              </InputLabel>
              <Switch
                id="name"
                checked={switchState == 1}
                onChange={(event, checked) => {
                  handleSwitchChange(checked)
                }}
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-start flex-col">
              <InputLabel htmlFor="percentage" className="mr-3 w-20 text-left mb-2.5">
                关联角色:
              </InputLabel>

              <Autocomplete
                disablePortal
                id="h_subpart_code"
                options={roleOption.map((item) => item.label)}
                fullWidth
                value={roleSelectState}
                multiple
                size="small"
                onChange={(event, value, reason, details) => {
                  setRoleSelectState(value)
                }}
                renderInput={(params) => <TextField {...params} label="请选择关联的角色" />}
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
              {/*<Select*/}
              {/*  value={roleSelectState}*/}
              {/*  onChange={handleRoleSelect}*/}
              {/*  MenuProps={{ sx: { zIndex: 1702 } }}*/}
              {/*  sx={{ flex: 1, zIndex: 1602 }}*/}
              {/*  id="role_list"*/}
              {/*  label="请选择关联的角色"*/}
              {/*  size="small"*/}
              {/*  multiple*/}
              {/*  fullWidth>*/}
              {/*  {roleOption.map((item) => (*/}
              {/*    <MenuItem value={item.value} key={item.value}>*/}
              {/*      {item.label}*/}
              {/*    </MenuItem>*/}
              {/*  ))}*/}
              {/*</Select>*/}
            </div>
          </div>

          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel htmlFor="desc" className="mr-3 w-20 text-left mb-2.5" required>
                表单说明:
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
                label="请输入工序说明"
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
  )
}
