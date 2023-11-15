import { Button, Drawer, InputLabel, MenuItem, Select, TextField } from "@mui/material"
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
import { TYPE_OPTION } from "@/app/project-management/const"
import { reqPostProject, reqPutProject } from "@/app/project-management/api"
import { reqGetEBS } from "@/app/ebs-profession/ebs-data/api"
import { TypeEBSDataList } from "@/app/ebs-profession/ebs-data/types"

interface Props {
  open: boolean
  // eslint-disable-next-line no-unused-vars
  close: () => void
  editItem: null | ProjectListData
  getDataList: () => void
}

export default function AddOrEditProject(props: Props) {
  const { open, close, editItem, getDataList } = props

  const { trigger: postProjectApi } = useSWRMutation("/project", reqPostProject)
  const { trigger: putProjectApi } = useSWRMutation("/project", reqPutProject)
  const { trigger: getEBSApi } = useSWRMutation("/ebs", reqGetEBS)

  const [ebsList, setEBSList] = React.useState<TypeEBSDataList[]>([])
  const getEBSDataList = async () => {
    const res = await getEBSApi({ level: 1 })
    setEBSList(res)
  }

  React.useEffect(() => {
    getEBSDataList()
  }, [])

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
      setCompletedAt(Number(editItem.completed_at))
      setExpiredAt(dayjs(editItem.expired_at))
      setStartedAt(dayjs(editItem.started_at))
      const descObj: DescJsonType = JSON.parse(editItem.desc || "{}")

      setValue("construction_organization", descObj.construction_organization)
      setValue("construction_unit", descObj.construction_unit)
      setValue("section_name", descObj.section_name)
      setValue("supervising_unit", descObj.supervising_unit)
      setValue("design_unit", descObj.design_unit)
      setValue("leader", descObj.leader)
    }
  }, [editItem])

  const [expiredAt, setExpiredAt] = React.useState<Dayjs | null>(dayjs(new Date()))

  const [startedAt, setStartedAt] = React.useState<Dayjs | null>(dayjs(new Date()))

  const [completedAt, setCompletedAt] = React.useState(0)

  const [projectType, setProjectType] = React.useState(0)

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
      if (!completedAt || !expiredAt || !startedAt) return message.error("请填写完数据在进行提交")

      const descObj: DescJsonType = {
        construction_organization: values.construction_organization,
        construction_unit: values.construction_unit,
        section_name: values.section_name,
        supervising_unit: values.supervising_unit,
        design_unit: values.design_unit,
        leader: values.leader,
      }

      const params = {
        name: values.name,
        cost: values.cost,
        creator: values.creator,
        abbreviation: values.abbreviation,
        completed_at: String(completedAt),
        expired_at: expiredAt!.format("YYYY-MM-DD HH:mm:ss"),
        started_at: startedAt!.format("YYYY-MM-DD HH:mm:ss"),
        desc: JSON.stringify(descObj),
      } as PutProjectParams

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

  return (
    <Drawer open={open} onClose={handleClose} anchor="right">
      <div className="w-[500px] p-10">
        <header className="text-3xl text-[#44566C] mb-8">
          {!!editItem ? "修改项目信息" : "添加项目信息"}
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel htmlFor="name" className="mr-3 w-full text-left mb-2.5" required>
                项目名称:
              </InputLabel>
              <TextField
                variant="outlined"
                id="name"
                size="small"
                fullWidth
                error={Boolean(errors.name)}
                {...register("name", {
                  required: "请输入项目名称",
                  onBlur() {
                    trigger("name")
                  },
                })}
                placeholder="项目名称"
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
                error={Boolean(errors.abbreviation)}
                {...register("abbreviation", {
                  required: "请输入项目简称",
                  onBlur() {
                    trigger("abbreviation")
                  },
                })}
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
              <InputLabel htmlFor="cost" className="mr-3 w-full text-left mb-2.5" required>
                工程造价:
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

          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel htmlFor="section_name" className="mr-3 w-full text-left mb-2.5" required>
                标段名称:
              </InputLabel>
              <TextField
                placeholder="标段名称"
                variant="outlined"
                id="section_name"
                size="small"
                fullWidth
                error={Boolean(errors.section_name)}
                {...register("section_name", {
                  required: "请输入标段名称",
                  onBlur() {
                    trigger("section_name")
                  },
                })}
                autoComplete="off"
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="section_name"
              render={({ message }) => (
                <p className="text-railway_error text-sm absolute">{message}</p>
              )}
            />
          </div>
          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel
                htmlFor="construction_unit"
                className="mr-3 w-full text-left mb-2.5"
                required>
                建设单位:
              </InputLabel>
              <TextField
                placeholder="建设单位"
                variant="outlined"
                id="construction_unit"
                size="small"
                fullWidth
                error={Boolean(errors.construction_unit)}
                {...register("construction_unit", {
                  required: "请输入建设单位",
                  onBlur() {
                    trigger("construction_unit")
                  },
                })}
                autoComplete="off"
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="construction_unit"
              render={({ message }) => (
                <p className="text-railway_error text-sm absolute">{message}</p>
              )}
            />
          </div>
          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel
                htmlFor="construction_organization"
                className="mr-3 w-full text-left mb-2.5"
                required>
                施工单位:
              </InputLabel>
              <TextField
                placeholder="施工单位"
                variant="outlined"
                id="construction_organization"
                size="small"
                fullWidth
                error={Boolean(errors.construction_organization)}
                {...register("construction_organization", {
                  required: "请输入施工单位",
                  onBlur() {
                    trigger("construction_organization")
                  },
                })}
                autoComplete="off"
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="construction_organization"
              render={({ message }) => (
                <p className="text-railway_error text-sm absolute">{message}</p>
              )}
            />
          </div>
          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel
                htmlFor="supervising_unit"
                className="mr-3 w-full text-left mb-2.5"
                required>
                监理单位:
              </InputLabel>
              <TextField
                placeholder="监理单位"
                variant="outlined"
                id="supervising_unit"
                size="small"
                fullWidth
                error={Boolean(errors.supervising_unit)}
                {...register("supervising_unit", {
                  required: "请输入监理单位",
                  onBlur() {
                    trigger("supervising_unit")
                  },
                })}
                autoComplete="off"
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="supervising_unit"
              render={({ message }) => (
                <p className="text-railway_error text-sm absolute">{message}</p>
              )}
            />
          </div>
          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel htmlFor="design_unit" className="mr-3 w-full text-left mb-2.5" required>
                设计单位:
              </InputLabel>
              <TextField
                placeholder="设计单位"
                variant="outlined"
                id="design_unit"
                size="small"
                fullWidth
                error={Boolean(errors.design_unit)}
                {...register("design_unit", {
                  required: "请输入设计单位",
                  onBlur() {
                    trigger("design_unit")
                  },
                })}
                autoComplete="off"
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="design_unit"
              render={({ message }) => (
                <p className="text-railway_error text-sm absolute">{message}</p>
              )}
            />
          </div>
          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel htmlFor="leader" className="mr-3 w-full text-left mb-2.5" required>
                项目负责人:
              </InputLabel>
              <TextField
                placeholder="项目负责人"
                variant="outlined"
                id="leader"
                size="small"
                fullWidth
                error={Boolean(errors.leader)}
                {...register("leader", {
                  required: "请输入项目负责人",
                  onBlur() {
                    trigger("leader")
                  },
                })}
                autoComplete="off"
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="leader"
              render={({ message }) => (
                <p className="text-railway_error text-sm absolute">{message}</p>
              )}
            />
          </div>

          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel htmlFor="name" className="mr-3 w-full text-left mb-2.5" required>
                平台项目过期时间:
              </InputLabel>
              <DateTimePicker
                // views={["year", "month", "day"]}
                format="YYYY-MM-DD HH:mm"
                ampm={false}
                label="到货日期"
                value={expiredAt}
                className="w-full"
                onChange={(newValue) => {
                  setExpiredAt(newValue)
                }}
              />
            </div>
          </div>

          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel htmlFor="name" className="mr-3 w-full text-left mb-2.5" required>
                项目开始时间:
              </InputLabel>
              <DateTimePicker
                // views={["year", "month", "day"]}
                format="YYYY-MM-DD HH:mm"
                ampm={false}
                label="到货日期"
                value={startedAt}
                className="w-full"
                onChange={(newValue) => {
                  setStartedAt(newValue)
                }}
              />
            </div>
          </div>

          <div className="mb-8 relative">
            <div className="flex items-start flex-col">
              <InputLabel htmlFor="name" className="mr-3 w-full text-left mb-2.5" required>
                项目关联的专业:
              </InputLabel>

              <Select
                MenuProps={{ sx: { zIndex: 1702, height: "400px" } }}
                sx={{ flex: 1, color: "#303133", zIndex: 1602 }}
                id="role_list"
                size="small"
                value={completedAt}
                onChange={(event) => {
                  setCompletedAt(Number(event.target.value))
                }}
                fullWidth>
                <MenuItem value={0}>
                  <i>请选择一个项目类型</i>
                </MenuItem>
                {ebsList.map((item) => (
                  <MenuItem value={item.id} key={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>

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
