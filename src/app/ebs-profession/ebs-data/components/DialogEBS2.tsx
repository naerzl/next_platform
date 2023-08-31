import React from "react"
import { TypeApiPostEBSParams, TypeEBSDataList } from "@/app/ebs-profession/ebs-data/types"
import useDebounce from "@/hooks/useDebounce"
import useSWRMutation from "swr/mutation"
import { reqPostEBS, reqPutEBS } from "@/app/ebs-profession/ebs-data/api"
import EBSDataContext from "@/app/ebs-profession/ebs-data/context/ebsDataContext"
import { Type_Is_system } from "@/app/ebs-profession/ebs-data/components/TableTr"
import { ENUM_SUBPARY_CLASS } from "@/libs/const"
import { reqGetSubsection } from "@/app/engineering/api"
import {
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
import { ErrorMessage } from "@hookform/error-message"
import { Button, Switch } from "@mui/material"
import { useForm } from "react-hook-form"
import { iconList } from "@/app/dictionary/components/IconEnum"

interface Props {
  open: boolean
  item: TypeEBSDataList
  // eslint-disable-next-line no-unused-vars
  changeDialogOpen: (open: boolean) => void
  deletedDataList: TypeEBSDataList[]
  addType: Type_Is_system
  isEdit: boolean
  // eslint-disable-next-line no-unused-vars
  changeIsEdit: (edit: boolean) => void
  // eslint-disable-next-line no-unused-vars
  handleGetParentChildren: (parentIndexArr: string[]) => void
  ebsOption: any[]
  // eslint-disable-next-line no-unused-vars
  getEBSOption: (value: string) => void
}

interface IForm {
  name: string
  is_loop: boolean
  unit: string
  subpart_class: string
  h_subpart_code: string
  n_subpart_code: string
  related_to: number
}

function DialogEBS(props: Props) {
  const ctx = React.useContext(EBSDataContext)
  const {
    open,
    item,
    changeDialogOpen,
    isEdit,
    changeIsEdit,
    handleGetParentChildren,
    getEBSOption,
    ebsOption,
  } = props

  // 添加EBS结构api
  const { trigger: postEBSApi } = useSWRMutation("/ebs", reqPostEBS)

  // 修改EBS结构api
  const { trigger: putEBSApi } = useSWRMutation("/ebs", reqPutEBS)

  // 获取分部分项列表
  const { trigger: getSubsectionApi } = useSWRMutation("/subsection", reqGetSubsection)

  // 弹窗取消事件

  const [apiParams, setApiParams] = React.useState<TypeApiPostEBSParams>({
    is_loop: "no",
    subpart_class: "",
  } as TypeApiPostEBSParams)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<IForm>({})

  const handleCancel = () => {
    reset()
    changeDialogOpen(false)
    changeIsEdit(false)
    setApiParams({ is_loop: "no" } as TypeApiPostEBSParams)
    getEBSOption("")
  }

  // 提交表单事件（防抖）
  const { run: onSubmit } = useDebounce(async (value: any) => {
    console.log(value)
    // if (isEdit) {
    //   await putEBSApi(
    //     Object.assign(apiParams, { id: item.id, name: item.name, unit: item.unit }, value),
    //   )
    //   const parentIndexArr = item.key?.split("-").slice(0, item.key?.split("-").length - 1)
    //   handleGetParentChildren(parentIndexArr as string[])
    // } else {
    //   await postEBSApi(Object.assign(apiParams, value, { parent_id: item.id }))
    //   // 添加
    //   ctx.handleExpandChange(true, item)
    // }
    // handleCancel()
  })

  React.useEffect(() => {
    if (isEdit) {
      setValue("name", item.name)
      setValue("unit", item.unit)
      if (item.subpart_class) {
        setValue("subpart_class", item.subpart_class)
      }
      setValue("h_subpart_code", item.h_subpart_code)
      setValue("n_subpart_code", item.n_subpart_code)
      setApiParams((pre) => ({ ...pre, is_loop: item.is_loop ? item.is_loop : "no" }))
      getHighOrNormalSpeed(item.subpart_class)
    }
  }, [isEdit])

  React.useEffect(() => {
    if (isEdit) {
      if (item.related_ebs) {
        setValue("related_to", item.related_ebs.id)
      }
    }
  }, [ebsOption])

  // 处理滑块切换时间
  const handleSwitchChange = (value: boolean) => {
    setApiParams((pre) => ({ ...pre, is_loop: value ? "yes" : "no" }))
  }

  const [highSpeed, setHighSpeed] = React.useState<any[]>([])
  const [normalSpeed, setNormalSpeed] = React.useState<any[]>([])

  const getHighOrNormalSpeed = (subpart_class: string) => {
    getSubsectionApi({ subpart_class, is_highspeed: 1 }).then((res) => {
      setHighSpeed(
        res.map((item) => ({
          ...item,
          value: item.code,
          label: `${item.class_name ? item.class_name + "-" : ""}${
            item.parent_name ? item.parent_name + "-" : ""
          }${item.name}-${item.code}`,
        })),
      )
    })
    getSubsectionApi({ subpart_class, is_highspeed: 0 }).then((res) => {
      setNormalSpeed(
        res.map((item) => ({
          ...item,
          value: item.code,
          label: `${item.class_name ? item.class_name + "-" : ""}${
            item.parent_name ? item.parent_name + "-" : ""
          }${item.name}-${item.code}`,
        })),
      )
    })
  }

  React.useEffect(() => {
    if (apiParams.subpart_class) {
      getHighOrNormalSpeed(apiParams.subpart_class)
      // reset({ h_subpart_code: "", n_subpart_code: "" })
    }
  }, [getValues("subpart_class")])

  // 页面加载获取当前目录下的所有EBS结构
  React.useEffect(() => {
    if (isEdit && item.related_ebs) {
      handleEBSSearch(item.related_ebs.name)
    }
  }, [isEdit])

  // 搜索功能
  const { run: handleEBSSearch } = useDebounce(async (value: string) => {
    getEBSOption(value)
  })

  console.log(getValues("subpart_class"))
  return (
    <>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle sx={{ px: "40px", pt: "30px" }}>{isEdit ? "修改" : "添加"}</DialogTitle>
        <DialogContent sx={{ px: "40px", pb: "30px", width: 600 }}>
          {/*表单*/}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/*ebs名称*/}
            <div className="mb-4">
              <div className="flex items-center">
                <InputLabel htmlFor="name" className="mr-3 w-36 text-right inline-block">
                  EBS名称*:
                </InputLabel>
                <TextField
                  id="name"
                  error={Boolean(errors.name)}
                  variant="outlined"
                  placeholder="请输入名称"
                  className="flex-1"
                  {...register("name", { required: "请输入名称" })}
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
                <InputLabel htmlFor="name" className="mr-3 w-36 text-right inline-block">
                  单位*:
                </InputLabel>
                <TextField
                  id="unit"
                  error={Boolean(errors.name)}
                  variant="outlined"
                  placeholder="请输入单位"
                  className="flex-1"
                  {...register("unit", { required: "请输入单位" })}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="unit"
                render={({ message }) => (
                  <p className="text-railway_error text-sm pl-24">{message}</p>
                )}
              />
            </div>
            {/*是否可循环*/}
            <div className="mb-4">
              <div className="flex items-center">
                <InputLabel htmlFor="name" className="mr-3 w-36 text-right inline-block">
                  <span>(选填)</span>是否可循环：
                </InputLabel>
                <Switch
                  id="name"
                  {...register("is_loop")}
                  onChange={(event, checked) => {
                    handleSwitchChange(checked)
                  }}
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center">
                <InputLabel htmlFor="subpart_class" className="mr-3 w-36 text-right inline-block">
                  <span>(选填)</span>节点类型:
                </InputLabel>
                <Select
                  error={Boolean(errors.subpart_class)}
                  sx={{ flex: 1 }}
                  id="subpart_class"
                  defaultValue={"examination"}
                  placeholder="请选择分部分项类型"
                  {...register("subpart_class")}>
                  {ENUM_SUBPARY_CLASS.map((item) => (
                    <MenuItem value={item.value} key={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
            {watch("subpart_class") != "examination" && Boolean(getValues("subpart_class")) && (
              <>
                <div className="mb-4">
                  <div className="flex items-center">
                    <InputLabel
                      htmlFor="h_subpart_code"
                      className="mr-3 w-36 text-right inline-block">
                      <span>(选填)</span>高速编码:
                    </InputLabel>
                    <Select
                      error={Boolean(errors.h_subpart_code)}
                      sx={{ flex: 1 }}
                      id="h_subpart_code"
                      placeholder="输入文字可检索"
                      defaultValue={"FolderOpenSharpIcon"}
                      {...register("h_subpart_code")}>
                      {highSpeed.map((item) => (
                        <MenuItem value={item.value} key={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center">
                    <InputLabel
                      htmlFor="n_subpart_code"
                      className="mr-3 w-36 text-right inline-block">
                      <span>(选填)</span>普速编码:
                    </InputLabel>
                    <Select
                      error={Boolean(errors.n_subpart_code)}
                      sx={{ flex: 1 }}
                      id="n_subpart_code"
                      placeholder="输入文字可检索"
                      {...register("n_subpart_code")}>
                      {normalSpeed.map((item) => (
                        <MenuItem value={item.value} key={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </>
            )}
            <DialogActions>
              <Button onClick={handleCancel}>取消</Button>
              <Button type="submit">确定</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DialogEBS
