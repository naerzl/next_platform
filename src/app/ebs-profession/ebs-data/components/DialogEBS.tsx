import React from "react"
import { Select } from "antd"
import { TypeApiPostEBSParams, TypeEBSDataList } from "@/app/ebs-profession/ebs-data/types"
import useDebounce from "@/hooks/useDebounce"
import useSWRMutation from "swr/mutation"
import { reqPostEBS, reqPutEBS } from "@/app/ebs-profession/ebs-data/api"
import EBSDataContext from "@/app/ebs-profession/ebs-data/context/ebsDataContext"
import { Type_Is_system } from "@/app/ebs-profession/ebs-data/components/TableTr"
import { ENUM_SUBPARY_CLASS } from "@/libs/const"
import { reqGetSubsection } from "@/app/engineering/api"
import { Button, DialogActions, Drawer, InputLabel, TextField, Switch } from "@mui/material"
import { ErrorMessage } from "@hookform/error-message"
import { useForm } from "react-hook-form"

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
    formState: { errors },
  } = useForm<IForm>()

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
    if (isEdit) {
      console.log(apiParams)
      await putEBSApi(
        Object.assign({ id: item.id, name: item.name, unit: item.unit }, apiParams, value),
      )
      const parentIndexArr = item.key?.split("-").slice(0, item.key?.split("-").length - 1)
      handleGetParentChildren(parentIndexArr as string[])
    } else {
      await postEBSApi(Object.assign({ parent_id: item.id }, apiParams, value))
      // 添加
      ctx.handleExpandChange(true, item)
    }
    handleCancel()
  })

  React.useEffect(() => {
    if (isEdit) {
      setValue("name", item.name)
      setValue("unit", item.unit)
      setApiParams((pre) =>
        item.subpart_class
          ? {
              ...pre,
              is_loop: item.is_loop ? item.is_loop : "no",
              h_subpart_code: item.h_subpart_code,
              n_subpart_code: item.n_subpart_code,
              subpart_class: item.subpart_class,
              related_to: item.related_ebs ? item.related_ebs.id : "",
            }
          : {
              ...pre,
              is_loop: item.is_loop ? item.is_loop : "no",
              h_subpart_code: item.h_subpart_code,
              n_subpart_code: item.n_subpart_code,
              related_to: item.related_ebs ? item.related_ebs.id : "",
            },
      )
      getHighOrNormalSpeed(item.subpart_class)
    }
  }, [isEdit])

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
    }
  }, [apiParams])

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

  const handleSubClassChange = (value: any, type: keyof TypeApiPostEBSParams) => {
    console.log(value)
    setApiParams((prevState) => ({ ...prevState, [type]: value }))
  }

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
              placeholder="请输入名称"
              className="flex-1"
              {...register("name", { required: "请输入名称" })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => <p className="text-railway_error text-sm pl-24">{message}</p>}
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
              placeholder="请输入单位"
              className="flex-1"
              {...register("unit", { required: "请输入单位" })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="unit"
            render={({ message }) => <p className="text-railway_error text-sm pl-24">{message}</p>}
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
              checked={apiParams.is_loop == "yes"}
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
            <Select
              className="w-full h-10"
              dropdownStyle={{ zIndex: 2000 }}
              id="subpart_class"
              allowClear
              placeholder="请选择分部分项类型"
              value={apiParams.subpart_class}
              onChange={(value) => {
                handleSubClassChange(value, "subpart_class")
              }}
              options={ENUM_SUBPARY_CLASS}></Select>
          </div>
        </div>
        {apiParams.subpart_class && apiParams.subpart_class != "examination" && (
          <>
            <div className="mb-8 relative">
              <div className="flex items-start flex-col">
                <InputLabel
                  htmlFor="h_subpart_code"
                  className="mr-3 mb-2.5 w-full text-left inline-block">
                  高速编码:
                </InputLabel>
                <Select
                  className="w-full h-10"
                  id="h_subpart_code"
                  dropdownStyle={{ zIndex: 2000 }}
                  allowClear
                  showSearch
                  placeholder="输入文字可检索"
                  value={apiParams.h_subpart_code}
                  onChange={(value) => {
                    handleSubClassChange(value, "h_subpart_code")
                  }}
                  filterOption={(input, option) => (option?.label ?? "").includes(input)}
                  options={highSpeed}></Select>
              </div>
            </div>
            <div className="mb-8 relative">
              <div className="flex items-start flex-col">
                <InputLabel
                  htmlFor="n_subpart_code"
                  className="mr-3 mb-2.5 w-full text-left inline-block">
                  普速编码:
                </InputLabel>
                <Select
                  className="w-full h-10"
                  id="n_subpart_code"
                  dropdownStyle={{ zIndex: 2000 }}
                  allowClear
                  showSearch
                  value={apiParams.n_subpart_code}
                  placeholder="输入文字可检索"
                  onChange={(value) => {
                    handleSubClassChange(value, "n_subpart_code")
                  }}
                  filterOption={(input, option) => (option?.label ?? "").includes(input)}
                  options={normalSpeed}></Select>
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
                value={apiParams.related_to}
                onChange={(value) => {
                  handleSubClassChange(value, "related_to")
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
