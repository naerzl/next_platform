import React from "react"
import { ReqGetAddCollectionClassResponse } from "../types"

const CollectionContext = React.createContext<{
  sideBarList: ReqGetAddCollectionClassResponse[]
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

export default CollectionContext
