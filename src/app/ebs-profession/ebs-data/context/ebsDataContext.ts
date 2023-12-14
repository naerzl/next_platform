import React from "react"
import { TypeEBSDataList } from "@/app/ebs-profession/ebs-data/types"

const EBSDataContext = React.createContext<{
  // eslint-disable-next-line no-unused-vars
  handleExpandChange: (expanded: boolean, record: TypeEBSDataList) => void
  tableData: TypeEBSDataList[]
  // eslint-disable-next-line no-unused-vars
  handleGetParentChildren: (parentIndexArr: string[]) => void
}>({
  handleExpandChange: () => {},
  tableData: [],
  handleGetParentChildren: () => {},
})

export default EBSDataContext
