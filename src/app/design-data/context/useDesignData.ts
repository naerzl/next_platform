import { createContext } from "react"
import { EBSTreeData } from "../types"

const DesignDataContext = createContext<{
  firstTreeList: EBSTreeData[]
  changeFirstTreeList: () => void
  ebs_id: number | string
  // eslint-disable-next-line no-unused-vars
  changeEBSId: (id: string | number) => void
  treeItem: EBSTreeData
  treeStr: string
  // eslint-disable-next-line no-unused-vars
  changeTreeStr: (str: string) => void
  isHavaNoSaveData: boolean
  // eslint-disable-next-line no-unused-vars
  changeIsHaveNoSaveData: (flag: boolean) => void
}>({
  firstTreeList: [],
  changeFirstTreeList: () => {},
  ebs_id: 0,
  changeEBSId: () => {},
  treeItem: {} as EBSTreeData,
  treeStr: "",
  changeTreeStr: () => {},
  isHavaNoSaveData: false,
  changeIsHaveNoSaveData: () => {},
})

export default DesignDataContext
