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
  Button,
  DialogActions,
  Drawer,
  InputLabel,
  TextField,
  Switch,
  Autocomplete,
  Chip,
} from "@mui/material"
import { ErrorMessage } from "@hookform/error-message"
import { useForm } from "react-hook-form"
import { Select } from "antd"

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
  unit: string
  // subpart_class: string
  // h_subpart_code: string
  // n_subpart_code: string
  // related_to: number
}

export default function dialogEBS(props: Props) {
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

  const [autoSubpart, setAutoSubpart] = React.useState<{ label: string; value: string } & any>(null)

  const [autoH, setAutoH] = React.useState<{ label: string; value: string } & any>(null)

  const [autoN, setAutoN] = React.useState<{ label: string; value: string } & any>(null)

  const [relatedTo, setRelatedTo] = React.useState("")

  const [switchState, setSwitchState] = React.useState("no")

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<IForm>()

  const handleCancel = () => {
    reset()
    changeDialogOpen(false)
    changeIsEdit(false)
    getEBSOption("")
    setAutoN(null)
    setAutoH(null)
    setRelatedTo("")
    setSwitchState("no")
  }

  // 提交表单事件（防抖）
  const { run: onSubmit } = useDebounce(async (value: any) => {
    if (isEdit) {
      await putEBSApi(
        Object.assign(
          {
            id: item.id,
            name: item.name,
            unit: item.unit,
            is_loop: switchState,
            h_subpart_code: autoH ? autoH.value : "",
            n_subpart_code: autoN ? autoN.value : "",
            subpart_class: autoSubpart ? autoSubpart.value : "",
            related_to: relatedTo ?? "",
          },
          value,
        ),
      )
      const parentIndexArr = item.key?.split("-").slice(0, item.key?.split("-").length - 1)
      handleGetParentChildren(parentIndexArr as string[])
    } else {
      await postEBSApi(
        Object.assign(
          {
            parent_id: item.id,
            is_loop: switchState,
            h_subpart_code: autoH ? autoH.value : "",
            n_subpart_code: autoN ? autoN.value : "",
            subpart_class: autoSubpart ? autoSubpart.value : "",
            related_to: relatedTo ?? "",
          },
          value,
        ),
      )
      // 添加
      ctx.handleExpandChange(true, item)
    }
    handleCancel()
  })

  const fillAutoComputedData = () => {
    const obj = ENUM_SUBPARY_CLASS.find((el) => item.subpart_class == el.value)
    setAutoSubpart(obj ?? null)
  }

  React.useEffect(() => {
    if (isEdit) {
      setValue("name", item.name)
      setValue("unit", item.unit)
      setSwitchState(item.is_loop)
      setRelatedTo((item.related_ebs ? item.related_ebs.id : "") as any)
      fillAutoComputedData()
      getHighOrNormalSpeed(item.subpart_class)
    }
  }, [isEdit])

  // 处理滑块切换时间
  const handleSwitchChange = (value: boolean) => {
    setSwitchState(value ? "yes" : "no")
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
    if (autoSubpart) {
      getHighOrNormalSpeed(autoSubpart.value)
    }
  }, [autoSubpart])

  // 页面加载获取当前目录下的所有EBS结构
  React.useEffect(() => {
    if (isEdit && item.related_ebs) {
      getEBSOption(item.related_ebs.name)
    }
  }, [isEdit])

  // 搜索功能
  const { run: handleEBSSearch } = useDebounce(async (value: string) => {
    getEBSOption(value)
  })

  React.useEffect(() => {
    if (isEdit) {
      if (highSpeed.length > 0) {
        const objH = highSpeed.find((el) => item.h_subpart_code == el.value)
        setAutoH(objH ?? null)
      }
      if (normalSpeed.length > 0) {
        const objN = normalSpeed.find((el) => item.n_subpart_code == el.value)
        setAutoN(objN ?? null)
      }
    }
  }, [highSpeed, normalSpeed])
  //  系统添加的 表单

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        {/*ebs名称*/}
        <div className="mb-8 relative">
          <div className="flex items-start flex-col">
            <InputLabel htmlFor="name" className="mr-3 mb-2.5 w-full text-left inline-block">
              EBS名称*:
            </InputLabel>
            <TextField
              id="name"
              fullWidth
              size="small"
              error={Boolean(errors.name)}
              variant="outlined"
              className="flex-1"
              label="请输入名称"
              autoComplete="off"
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
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => <p className="text-railway_error text-sm ">{message}</p>}
          />
        </div>
        <div className="mb-8 relative">
          <div className="flex items-start flex-col">
            <InputLabel htmlFor="name" className="mr-3 mb-2.5 w-full text-left inline-block">
              单位*:
            </InputLabel>
            <TextField
              id="unit"
              size="small"
              error={Boolean(errors.name)}
              fullWidth
              variant="outlined"
              label={"请输入单位"}
              autoComplete="off"
              className="flex-1"
              {...register("unit", {
                required: "请输入单位",
                maxLength: {
                  value: 16,
                  message: "文本字数最多16个",
                },
                onBlur() {
                  trigger("unit")
                },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="unit"
            render={({ message }) => <p className="text-railway_error text-sm ">{message}</p>}
          />
        </div>
        {/*是否可循环*/}
        <div className="mb-8 relative">
          <div className="flex items-start flex-col">
            <InputLabel htmlFor="name" className="mr-3 mb-2.5 w-full text-left inline-block">
              <span>(选填)</span>是否可循环：
            </InputLabel>
            <Switch
              id="name"
              checked={switchState == "yes"}
              onChange={(event, checked) => {
                handleSwitchChange(checked)
              }}
            />
          </div>
        </div>
        <div className="mb-8 relative">
          <div className="flex items-start flex-col">
            <InputLabel
              htmlFor="subpart_class"
              className="mr-3 mb-2.5 w-full text-left inline-block">
              <span>(选填)</span>节点类型:
            </InputLabel>

            <Autocomplete
              disablePortal
              id="subpart_class"
              options={ENUM_SUBPARY_CLASS}
              fullWidth
              value={autoSubpart}
              size="small"
              onChange={(event, value, reason, details) => {
                setAutoSubpart(value)
                setAutoH(null)
                setAutoN(null)
              }}
              renderInput={(params) => <TextField {...params} label="请选择分部分项类型" />}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )
              }}
              renderTags={(tagValue, getTagProps) => {
                return tagValue.map((option, index) => (
                  <Chip {...getTagProps({ index })} key={option.value} label={option.label} />
                ))
              }}
            />
          </div>
        </div>
        {autoSubpart && autoSubpart.value != "examination" && (
          <>
            <div className="mb-8 relative">
              <div className="flex items-start flex-col">
                <InputLabel
                  htmlFor="h_subpart_code"
                  className="mr-3 mb-2.5 w-full text-left inline-block">
                  高速编码:
                </InputLabel>

                <Autocomplete
                  disablePortal
                  id="h_subpart_code"
                  options={highSpeed}
                  fullWidth
                  value={autoH}
                  size="small"
                  onChange={(event, value, reason, details) => {
                    setAutoH(value)
                  }}
                  renderInput={(params) => <TextField {...params} label="请选择高速编码" />}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.value}>
                        {option.label}
                      </li>
                    )
                  }}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip {...getTagProps({ index })} key={option.value} label={option.label} />
                    ))
                  }}
                />
              </div>
            </div>
            <div className="mb-8 relative">
              <div className="flex items-start flex-col">
                <InputLabel
                  htmlFor="n_subpart_code"
                  className="mr-3 mb-2.5 w-full text-left inline-block">
                  普速编码:
                </InputLabel>
                <Autocomplete
                  disablePortal
                  id="n_subpart_code"
                  options={normalSpeed}
                  fullWidth
                  value={autoN}
                  size="small"
                  onChange={(event, value, reason, details) => {
                    setAutoN(value)
                  }}
                  renderInput={(params) => <TextField {...params} label="请选择普速编码" />}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.value}>
                        {option.label}
                      </li>
                    )
                  }}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip {...getTagProps({ index })} key={option.value} label={option.label} />
                    ))
                  }}
                />
              </div>
            </div>
          </>
        )}

        {(item.is_system != "system" || !isEdit) && (
          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel htmlFor="name" className="mr-3 mb-2.5 w-full text-left inline-block">
                关联EBS:
              </InputLabel>
              <Select
                dropdownStyle={{ zIndex: 2000 }}
                className="w-full h-10"
                defaultActiveFirstOption={false}
                filterOption={false}
                showSearch
                allowClear
                notFoundContent={null}
                placeholder="搜索关联EBS节点"
                options={ebsOption}
                value={relatedTo}
                onChange={(value) => {
                  setRelatedTo(value)
                }}
                onSearch={handleEBSSearch}></Select>
            </div>
          </div>
        )}
        <DialogActions>
          <Button onClick={handleCancel}>取消</Button>
          <Button type="submit" className="bg-railway_blue text-white">
            确定
          </Button>
        </DialogActions>
      </form>
    )
  }

  return (
    <>
      <Drawer open={open} onClose={handleCancel} anchor="right">
        <div className="w-[500px] p-10">
          <header className="text-3xl text-[#44566C] mb-8">{isEdit ? "修改ebs" : "添加ebs"}</header>
          {renderForm()}
        </div>
      </Drawer>
    </>
  )
}
