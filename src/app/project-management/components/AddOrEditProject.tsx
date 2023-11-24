import { Button, Drawer, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import React from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import useDebounce from "@/hooks/useDebounce"
import dayjs, { Dayjs } from "dayjs"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { ErrorMessage } from "@hookform/error-message"

import useSWRMutation from "swr/mutation"

import { message } from "antd"
import {
  DescJsonType,
  PostProjectParams,
  ProjectListData,
  PutProjectParams,
} from "@/app/project-management/types"
import { TYPE_CLASS, TYPE_OPTION } from "@/app/project-management/const"
import { reqPostProject, reqPutProject } from "@/app/project-management/api"
import { reqGetEBS } from "@/app/ebs-profession/ebs-data/api"
import { dateToYYYYMM } from "@/libs/methods"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import AddIcon from "@mui/icons-material/Add"
import { DatePicker } from "@mui/x-date-pickers"

interface Props {
  open: boolean
  // eslint-disable-next-line no-unused-vars
  close: () => void
  editItem: null | ProjectListData
  getDataList: () => void
  type: TYPE_CLASS
}

const Tamplate = [
  {
    key: "标段名称",
    value: "",
  },
  {
    key: "建设单位",
    value: "",
  },
  {
    key: "施工单位",
    value: "",
  },
  {
    key: "监理单位",
    value: "",
  },
  {
    key: "设计单位",
    value: "",
  },
  {
    key: "项目负责人",
    value: "",
  },
]

export default function AddOrEditProject(props: Props) {
  const { open, close, editItem, getDataList, type } = props

  const { trigger: putProjectApi } = useSWRMutation("/project", reqPutProject)
  const { trigger: getEBSApi } = useSWRMutation("/ebs", reqGetEBS)

  // const [ebsList, setEBSList] = React.useState<TypeEBSDataList[]>([])
  // const getEBSDataList = async () => {
  //   const res = await getEBSApi({ level: 1 })
  //   setEBSList(res)
  // }
  //
  // React.useEffect(() => {
  //   getEBSDataList()
  // }, [])

  const handleClose = () => {
    close()
    reset()
  }

  React.useEffect(() => {
    if (editItem) {
      setValue("name", editItem.name)
      setValue("cost", editItem.cost)
      setValue("creator", editItem.creator)
      setValue("abbreviation", editItem.abbreviation)
      setProjectType(type == "zheng" ? "official" : "trial")
      setExpiredAt(dayjs(editItem.expired_at).utc())
      const descObj: any = JSON.parse(editItem.desc || "[]")

      console.log(descObj)
      // setProperty(JSON.parse(descObj))
    }
  }, [editItem])

  const [expiredAt, setExpiredAt] = React.useState<Dayjs | null>(dayjs(new Date()))

  const [projectType, setProjectType] = React.useState("null")

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
    trigger,
    setValue,
  } = useForm<PostProjectParams & DescJsonType>()

  const { run: onSubmit }: { run: SubmitHandler<PostProjectParams & DescJsonType> } = useDebounce(
    async (values: PostProjectParams & DescJsonType) => {
      if (!expiredAt) return message.error("请填写完数据在进行提交")
      if (projectType == "null") return message.error("请选择项目类型")
      if (property.length > 0) {
        const someValue = property.some((item) => {
          return item.value == "" || item.key == ""
        })
        if (someValue && type == "zheng") return message.warning("添加的数据不可为空")
      }

      const params = {
        name: values.name,
        cost: values.cost,
        // creator: values.creator,
        // abbreviation: values.abbreviation,

        desc: JSON.stringify(property),
        class: projectType,
      } as PutProjectParams

      if (type == "yan") {
        params.expired_at = dateToYYYYMM(expiredAt!)
      }

      if (Boolean(editItem)) {
        params.id = editItem!.id
        await putProjectApi(params)
      } else {
      }
      message.success("操作成功")
      handleClose()
      getDataList()
    },
  )

  const [property, setProperty] = React.useState<{ key: string; value: string }[]>(Tamplate)

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
          {type == "zheng" ? "转正信息填写" : "修改项目信息"}
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel htmlFor="name" className="mr-3 w-full text-left mb-2.5" required>
                项目全称:
              </InputLabel>
              <TextField
                variant="outlined"
                id="name"
                size="small"
                fullWidth
                disabled={type == "yan"}
                error={Boolean(errors.name)}
                {...register("name", {
                  required: "请输入项目全称",
                  onBlur() {
                    trigger("name")
                  },
                })}
                placeholder="项目全称"
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
              <InputLabel htmlFor="creator" className="mr-3 w-full text-left mb-2.5" required>
                创建者:
              </InputLabel>
              <TextField
                placeholder="创建者"
                variant="outlined"
                id="creator"
                size="small"
                fullWidth
                disabled
                error={Boolean(errors.creator)}
                {...register("creator", {
                  required: "请输入创建者",
                  onBlur() {
                    trigger("creator")
                  },
                })}
                autoComplete="off"
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="creator"
              render={({ message }) => (
                <p className="text-railway_error text-sm absolute">{message}</p>
              )}
            />
          </div>
          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel htmlFor="abbreviation" className="mr-3 w-full text-left mb-2.5" required>
                项目简称:
              </InputLabel>
              <TextField
                placeholder="项目简称"
                variant="outlined"
                id="abbreviation"
                size="small"
                fullWidth
                disabled
                error={Boolean(errors.abbreviation)}
                {...register("abbreviation")}
                autoComplete="off"
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="abbreviation"
              render={({ message }) => (
                <p className="text-railway_error text-sm absolute">{message}</p>
              )}
            />
          </div>

          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel htmlFor="name" className="mr-3 w-full text-left mb-2.5" required>
                项目状态:
              </InputLabel>

              <Select
                MenuProps={{ sx: { zIndex: 1702, height: "400px" } }}
                sx={{ flex: 1, color: "#303133", zIndex: 1602 }}
                id="role_list"
                size="small"
                value={projectType}
                disabled
                onChange={(event) => {
                  setProjectType(event.target.value)
                }}
                fullWidth>
                <MenuItem value={"null"}>
                  <i className="text-[#c2c2c2]">请选择一个项目类型</i>
                </MenuItem>
                {TYPE_OPTION.map((item: any) => (
                  <MenuItem value={item.value} key={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel htmlFor="cost" className="mr-3 w-full text-left mb-2.5" required>
                工程造价（元）:
              </InputLabel>
              <TextField
                placeholder="工程造价"
                variant="outlined"
                id="cost"
                size="small"
                fullWidth
                error={Boolean(errors.cost)}
                {...register("cost", {
                  required: "请输入工程造价",
                  onBlur() {
                    trigger("cost")
                  },
                })}
                autoComplete="off"
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="cost"
              render={({ message }) => (
                <p className="text-railway_error text-sm absolute">{message}</p>
              )}
            />
          </div>

          {type == "zheng" && (
            <>
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
            </>
          )}

          {type != "zheng" && (
            <div className="mb-8 relative">
              <div className="flex items-start flex-col">
                <InputLabel htmlFor="name" className="mr-3 w-full text-left mb-2.5" required>
                  平台项目过期时间:
                </InputLabel>
                <DatePicker
                  // views={["year", "month", "day"]}
                  format="YYYY-MM-DD"
                  value={expiredAt}
                  className="w-full"
                  onChange={(newValue) => {
                    setExpiredAt(newValue)
                  }}
                />
              </div>
            </div>
          )}

          {/*<div className="mb-8 relative">*/}
          {/*  <div className="flex items-start flex-col">*/}
          {/*    <InputLabel htmlFor="name" className="mr-3 w-full text-left mb-2.5" required>*/}
          {/*      项目开始时间:*/}
          {/*    </InputLabel>*/}
          {/*    <DateTimePicker*/}
          {/*      // views={["year", "month", "day"]}*/}
          {/*      format="YYYY-MM-DD HH:mm"*/}
          {/*      ampm={false}*/}
          {/*      label="到货日期"*/}
          {/*      value={startedAt}*/}
          {/*      className="w-full"*/}
          {/*      onChange={(newValue) => {*/}
          {/*        setStartedAt(newValue)*/}
          {/*      }}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/*<div className="mb-8 relative">*/}
          {/*  <div className="flex items-start flex-col">*/}
          {/*    <InputLabel htmlFor="name" className="mr-3 w-full text-left mb-2.5" required>*/}
          {/*      项目关联的专业:*/}
          {/*    </InputLabel>*/}

          {/*    <Select*/}
          {/*      MenuProps={{ sx: { zIndex: 1702, height: "400px" } }}*/}
          {/*      sx={{ flex: 1, color: "#303133", zIndex: 1602 }}*/}
          {/*      id="role_list"*/}
          {/*      size="small"*/}
          {/*      value={completedAt}*/}
          {/*      onChange={(event) => {*/}
          {/*        setCompletedAt(Number(event.target.value))*/}
          {/*      }}*/}
          {/*      fullWidth>*/}
          {/*      <MenuItem value={0}>*/}
          {/*        <i>请选择一个项目类型</i>*/}
          {/*      </MenuItem>*/}
          {/*      {ebsList.map((item) => (*/}
          {/*        <MenuItem value={item.id} key={item.id}>*/}
          {/*          {item.name}*/}
          {/*        </MenuItem>*/}
          {/*      ))}*/}
          {/*    </Select>*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/*<div className="mb-8 relative">*/}
          {/*  <div className="flex items-start flex-col">*/}
          {/*    <InputLabel htmlFor="name" className="mr-3 w-full text-left mb-2.5" required>*/}
          {/*      项目类型:*/}
          {/*    </InputLabel>*/}

          {/*    <Select*/}
          {/*      MenuProps={{ sx: { zIndex: 1702, height: "400px" } }}*/}
          {/*      sx={{ flex: 1, color: "#303133", zIndex: 1602 }}*/}
          {/*      id="role_list"*/}
          {/*      size="small"*/}
          {/*      value={projectType}*/}
          {/*      onChange={(event) => {*/}
          {/*        setProjectType(Number(event.target.value))*/}
          {/*      }}*/}
          {/*      fullWidth>*/}
          {/*      <MenuItem value={0}>*/}
          {/*        <i>请选择一个项目类型</i>*/}
          {/*      </MenuItem>*/}
          {/*      {TYPE_OPTION.map((item: any) => (*/}
          {/*        <MenuItem value={item.value} key={item.value}>*/}
          {/*          {item.label}*/}
          {/*        </MenuItem>*/}
          {/*      ))}*/}
          {/*    </Select>*/}
          {/*  </div>*/}
          {/*</div>*/}

          <div className="flex justify-end gap-2">
            <Button onClick={handleClose}>取消</Button>
            <Button type="submit" className="bg-railway_blue text-white">
              确定
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}
