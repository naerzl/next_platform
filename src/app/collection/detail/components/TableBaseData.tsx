"use client"
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputBase,
  InputLabel,
  Menu,
  MenuItem,
  Select,
} from "@mui/material"
import React from "react"
import { DESIGN_DATA_OPTIONS } from "@/app/design-data/const"
import AddIcon from "@mui/icons-material/Add"
import { CollectionData } from "../../types"
import { useSearchParams } from "next/navigation"
import useSWRMutation from "swr/mutation"
import useSWR from "swr"
import { reqDelEBSStructure, reqGetEBSStructure, reqPostEBSStructure } from "../../api"
import { message } from "antd"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import { Cascader } from "antd"
import { reqGetDictionary, reqGetDictionaryClass } from "@/app/dictionary/api"
import { DictionaryClassData } from "@/app/dictionary/types"

export default function TableBaseData() {
  const search = useSearchParams()
  const { trigger: getEBSStructureApi } = useSWRMutation("/ebs-structure", reqGetEBSStructure)
  const searchParams = {
    collection_id: Number(search.get("collection_id")),
  }
  const [dataList, setDataList] = React.useState<CollectionData[]>([])
  const getBaseDataList = React.useCallback(async () => {
    const res = await getEBSStructureApi(searchParams)
    setDataList(res || [])
  }, [search])

  React.useEffect(() => {
    if (search.has("collection_id")) {
      getBaseDataList()
    }
  }, [getBaseDataList])

  const handleAddRow = () => {
    setDataList([...dataList, { is_required: 0, title: "", type: 1 }])
  }

  const changeArr1 = (index: number, value: any) => {
    const newArr: any = structuredClone(dataList)
    newArr[index] = { ...newArr[index], ...value }
    setDataList(newArr)
    // return Promise.resolve("")
  }

  const changeArr = (index: number, type: keyof CollectionData, value: any) => {
    const newArr: any = structuredClone(dataList)
    newArr[index][type] = value
    if (type == "is_required") newArr[index][type] = Number(value)
    setDataList(newArr)
    // return Promise.resolve("")
  }

  const { trigger: postEBSStructureApi } = useSWRMutation("/ebs-structure", reqPostEBSStructure)

  const [idArr, setIdArr] = React.useState<string[]>([])
  const handleClickSave = async () => {
    setIdArr([])
    if (dataList.length <= 0) return message.warning("请先添加数据")
    const arr = []
    for (let index = 0; index < dataList.length; index++) {
      for (let j = index + 1; j < dataList.length; j++) {
        if (dataList[index].title == dataList[j].title) {
          arr.push(dataList[index].title, dataList[j].title)
        }
      }
    }
    setIdArr(arr)

    if (arr.length > 0) return
    await postEBSStructureApi({ ...searchParams, data: JSON.stringify(dataList) })
    message.success("操作成功")
    getBaseDataList()
  }

  const { trigger: delEBSStructureApi } = useSWRMutation("/ebs-structure", reqDelEBSStructure)

  const handleClickDel = async (id: number) => {
    await delEBSStructureApi({ id })
    message.success("删除成功")
    getBaseDataList()
  }

  const { data } = useSWR(
    "/dictionary-class",
    (url) => reqGetDictionaryClass(url, { arg: { limit: 15, page: 1 } }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  const { trigger: getDictionaryClassApi } = useSWRMutation(
    "/dictionary-class",
    reqGetDictionaryClass,
  )

  const { trigger: getDictionaryApi } = useSWRMutation("/dictionary", reqGetDictionary)

  const [options, setOptions] = React.useState<DictionaryClassData[] | any[]>([])
  React.useEffect(() => {
    data &&
      data.items?.length > 0 &&
      options.length <= 0 &&
      setOptions(data.items.map((item) => ({ ...item, isLeaf: false })))
  }, [data])

  const loadData = async (selectedOptions: DictionaryClassData[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1] as any
    // load options lazily
    const res = await getDictionaryClassApi({ limit: 15, page: 1, parent_id: targetOption.id })
    if (res.items && res.items.length > 0) {
      setTimeout(() => {
        targetOption.children = res.items.map((item) => ({ ...item, isLeaf: false }))
        setOptions([...options])
      }, 800)
    } else {
      setTimeout(async () => {
        const res = await getDictionaryApi({
          class_id: targetOption.id,
          limit: 15,
          page: 1,
          order: "serial",
        })

        delete targetOption.isLeaf
        if (res.items && res.items.length > 0) {
          targetOption.children = res.items
        } else {
          delete targetOption.children
        }
        setOptions([...options])
      }, 800)
    }
  }

  const hanldeChangeCascader = async (
    value: (string | number)[],
    selectedOptions: DictionaryClassData[],
    index: number,
  ) => {
    console.log(value, selectedOptions, index)
    if (value) {
      changeArr1(index, {
        dictionary_id: value[value.length - 1],
        dictionary_data: JSON.stringify([selectedOptions[0]]),
      })
      // changeArr(index, )
    } else {
      changeArr(index, "dictionary_data", "[]")
      changeArr(index, "dictionary_id", 0)
    }
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div className="flex-1 flex-shrink-0 overflow-auto">
      <div className="overflow-hidden w-full">
        <div className="float-left ml-2">
          表结构名称：
          <span className="border  h-9 leading-[2.25rem] pl-2 text-ellipsis whitespace-nowrap  w-80 inline-block">
            {search.get("name")}
          </span>
        </div>
        <Button
          variant="outlined"
          className="float-right"
          onClick={() => {
            handleClickSave()
          }}>
          保存
        </Button>
      </div>
      {/* 数据 */}
      {dataList.map((item, index) => (
        <div
          className="flex py-3 items-center justify-around border-b border-dotted text-railway_303"
          key={index}>
          <div>{`第${index + 1}列`}</div>
          <div className="flex items-center gap-x-2">
            <InputLabel
              className="text-railway_303"
              style={idArr.includes(item.title) ? { color: "#d32f2f" } : {}}>
              标题
            </InputLabel>
            <InputBase
              sx={{
                border: `1px solid ${idArr.includes(item.title) ? "#d32f2f" : "#ccc"}`,
                height: 40,
              }}
              value={item.title}
              onChange={(e) => {
                changeArr(index, "title", e.target.value.trim())
              }}
            />
          </div>
          <div className="flex py-1 items-center gap-x-2">
            <InputLabel className="text-railway_303">类型</InputLabel>
            <Select
              size="small"
              className="w-32"
              defaultValue={1}
              value={item.type}
              onChange={(e) => {
                changeArr(index, "type", e.target.value)
              }}>
              {DESIGN_DATA_OPTIONS.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="w-60">
            {item.type == 4 && (
              <div className="flex py-1 items-center gap-x-2">
                <InputLabel className="text-railway_303">选项</InputLabel>
                <Cascader
                  displayRender={(label) => {
                    return <div>{label[label.length - 1]}</div>
                  }}
                  fieldNames={{ label: "name", value: "id" }}
                  options={options}
                  loadData={loadData}
                  onChange={(value, selectOption) => {
                    hanldeChangeCascader(value, selectOption, index)
                  }}
                  size="large"
                  className="bg-transparent"
                />
              </div>
            )}
          </div>
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(item.is_required)}
                  onChange={(e) => {
                    changeArr(index, "is_required", e.target.checked)
                  }}
                />
              }
              label="必填"
            />
          </div>
          <div className="w-10 h-10">
            {item.id && (
              <IconButton onClick={() => handleClickDel(item.id as number)}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        </div>
      ))}

      <div>
        <IconButton className="text-railway_blue" onClick={handleAddRow}>
          <AddIcon className="text-[2.15rem]" />
        </IconButton>
      </div>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  )
}
