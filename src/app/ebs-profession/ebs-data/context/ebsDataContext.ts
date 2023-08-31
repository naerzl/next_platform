import React from "react"
import { TypeEBSDataList } from "@/app/ebs-profession/ebs-data/types"

const EBSDataContext = React.createContext<{
  // eslint-disable-next-line no-unused-vars
  handleExpandChange: (expanded: boolean, record: TypeEBSDataList) => void
  tableData: TypeEBSDataList[]
}>({
  handleExpandChange: () => {},
  tableData: [],
})

export default EBSDataContext
