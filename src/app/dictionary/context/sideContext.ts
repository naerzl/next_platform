import React from "react"
import { DictionaryClassData } from "../types"

const SideContext = React.createContext<{
  sideBarList: DictionaryClassData[]
  changeSideBarList: () => void
  currentClassId: number
  // eslint-disable-next-line no-unused-vars
  changeCurrentClassId: (currentId: number) => void
  // eslint-disable-next-line no-unused-vars
  getSubClassList: (id: number, indexStr: string) => void
}>({
  sideBarList: [],
  changeSideBarList: () => {},
  currentClassId: 1,
  changeCurrentClassId: () => {},
  getSubClassList: () => {},
})

export default SideContext
