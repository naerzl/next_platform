import React from "react"
import { Button, DialogActions, Drawer, InputLabel, Menu, TextField } from "@mui/material"
import { ErrorMessage } from "@hookform/error-message"
import { SubmitHandler, useForm } from "react-hook-form"
import useDebounce from "@/hooks/useDebounce"
import useSWRMutation from "swr/mutation"
import { ProcessListDataType } from "@/app/process-list/types"
import { RequireTag } from "@/libs/other"
import Tree from "@/app/material-loss-coefficient/components/Tree"
import { TypeApiGetEBSParams, TypeEBSDataList } from "@/app/ebs-profession/ebs-data/types"
import { reqGetEBS } from "@/app/ebs-profession/ebs-data/api"

type Props = {
  open: boolean
  handleCloseDrawerAddLossCoefficient: () => void
  editItem: ProcessListDataType | null
}

type IForm = {
  name: string
  desc: string
  serial: number
  tags: string
}

export default function AddOrEditLossCoefficient(props: Props) {
  const { open, handleCloseDrawerAddLossCoefficient, editItem } = props

  const { trigger: getEBSApi } = useSWRMutation("/ebs", reqGetEBS)

  const handleClose = () => {
    handleCloseDrawerAddLossCoefficient()
  }

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    trigger,
  } = useForm<IForm>({})

  const handleSetFormValue = (item: ProcessListDataType) => {}

  React.useEffect(() => {
    if (Boolean(editItem)) {
      handleSetFormValue(editItem as ProcessListDataType)
    }
  }, [editItem])

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const [ebsAll, setEBSAll] = React.useState<any[]>([])

  const getEBSData = async () => {
    const params: TypeApiGetEBSParams = { level: 1 }

    const res = await getEBSApi(params)

    setEBSAll(res)
    return []
  }

  React.useEffect(() => {
    getEBSData()
  }, [])

  const getSubEBSData = async (ebsItem: TypeEBSDataList, pos: string, type: boolean) => {
    const ebsAllValue = structuredClone(ebsAll)

    let arr: TypeEBSDataList[] = []
    // 展开
    if (type) {
      const ebsParams = {
        level: ebsItem.level + 1,
        code: ebsItem.code,
      } as TypeApiGetEBSParams

      arr = await getEBSApi(ebsParams)

      const indexArr = pos.split("-")
      const evalStr = `ebsAllValue[${indexArr.join("].children[")}]`

      eval(`${evalStr}.children= arr`)

      setEBSAll(ebsAllValue)
    } else {
      //   关闭
      const indexArr = pos.split("-")
      const evalStr = `ebsAllValue[${indexArr.join("].children[")}]`
      eval(`${evalStr}.children=[]`)
      setEBSAll(ebsAllValue)
    }

    return arr.length
  }

  const [checkedArr, setCheckedArr] = React.useState<number[]>([])

  const [checkedEBSList, setCheckedEBSList] = React.useState<TypeEBSDataList[]>([])

  const handleChecked = (
    checkedValue: number[],
    checked: boolean,
    checkedEBSList: TypeEBSDataList[],
  ) => {
    setCheckedEBSList(checkedEBSList)
    setCheckedArr(checkedValue)
  }

  const { run: onSubmit }: { run: SubmitHandler<IForm> } = useDebounce(async (values: IForm) => {})

  return (
    <>
      <Drawer open={open} onClose={handleClose} anchor="right" sx={{ zIndex: 1601 }}>
        <div className="w-[500px] p-10">
          <header className="text-3xl text-[#44566C] mb-8">
            {Boolean(editItem) ? "修改损耗系数" : "添加损耗系数"}
          </header>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-8">
              <div className="flex items-start flex-col">
                <InputLabel htmlFor="percentage" className="mr-3 text-left mb-2.5">
                  <RequireTag>损耗系数名称:</RequireTag>
                </InputLabel>
                <TextField
                  variant="outlined"
                  id="percentage"
                  size="small"
                  fullWidth
                  error={Boolean(errors.serial)}
                  {...register("serial", {
                    required: "请输入损耗系数名称",
                    onBlur() {
                      trigger("serial")
                    },
                  })}
                  placeholder="请输入损耗系数名称"
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
                <InputLabel htmlFor="desc" className="mr-3 w-full text-left mb-2.5">
                  <RequireTag>关联工程结构:</RequireTag>
                </InputLabel>
                <div className="w-full">
                  <div
                    className="border h-10 w-full cursor-pointer border-[#c4c4c4] rounded flex items-center indent-3.5 "
                    onClick={(event) => {
                      setAnchorEl(event.currentTarget)
                    }}>
                    <div className="text-ellipsis overflow-hidden whitespace-nowrap w-full">
                      {checkedEBSList.map((item) => item.name).join(",")}
                    </div>
                  </div>
                  <Menu
                    id="basic-menu"
                    sx={{ zIndex: 1700 }}
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}>
                    <div
                      className="max-h-[500px] overflow-y-auto"
                      style={{ width: `${anchorEl?.getBoundingClientRect().width}px` }}>
                      <Tree
                        checkedEBSList={checkedEBSList}
                        checkArr={checkedArr}
                        treeData={ebsAll}
                        onChecked={(checkedValue, checked, checkedEBSList) => {
                          handleChecked(checkedValue, checked, checkedEBSList)
                        }}
                        getSubEBSData={({ ebsItem, pos }, type) => {
                          return getSubEBSData(ebsItem, pos, type)
                        }}
                      />
                    </div>
                  </Menu>
                </div>
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
