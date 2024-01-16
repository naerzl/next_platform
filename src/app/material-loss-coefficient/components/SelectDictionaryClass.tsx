"use client"
import React from "react"

import TreeWithDIctionaryClass from "@/app/material-loss-coefficient/components/TreeWithDIctionaryClass"
import { Menu } from "@mui/material"
import useSWRMutation from "swr/mutation"
import { reqGetDictionaryClass } from "@/app/dictionary/api"
import { DictionaryTreeData } from "@/app/material-loss-coefficient/types"

type Props = {
  // eslint-disable-next-line no-unused-vars
  onChange: (id: number, label: string) => void
  placeholder?: string
  disabled?: boolean
  value?: number
}

function SelectDictionaryClass(props: Props) {
  let { onChange: onChangeWithProps, placeholder, disabled, value: valueProps } = props

  const [nameView, setNameView] = React.useState("")
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)

  const { trigger: getDictionaryClassApi } = useSWRMutation(
    "/dictionary-class",
    reqGetDictionaryClass,
  )

  const [treeData, setTreeData] = React.useState<DictionaryTreeData[]>([])

  const getDictionaryClassList = async () => {
    const res = await getDictionaryClassApi({ parent_id: 1 })
    console.log(res)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const findFlatData = () => {}

  React.useEffect(() => {}, [valueProps])

  const onChange = (newValue: number, label: string) => {
    setNameView(label)
    setAnchorEl(null)
    onChangeWithProps(newValue, label)
  }
  return (
    <div className="w-full">
      <div
        className="border h-10 w-full cursor-pointer border-[#c4c4c4] rounded flex items-center indent-3.5"
        onClick={(event) => {
          setAnchorEl(event.currentTarget)
        }}>
        {nameView ? nameView : <span className="text-railway_gray">请选择字典分类</span>}
      </div>
      <Menu
        id="basic-menu"
        sx={{ zIndex: 1700 }}
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          sx: { zIndex: 1700, width: "600px" },
        }}>
        <div className="max-h-[500px] overflow-y-auto w-full">
          <TreeWithDIctionaryClass
            treeData={[]}
            onChecked={(checkedValue, checked, name) => {
              onChange(checkedValue, name)
            }}
          />
        </div>
      </Menu>
    </div>
  )
}

export default SelectDictionaryClass
