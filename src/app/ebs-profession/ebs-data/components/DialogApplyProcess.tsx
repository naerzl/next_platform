import React from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material"
import useSWRMutation from "swr/mutation"
import { reqGetProcess, reqGetTagsList } from "@/app/process-list/api"
import { ProcessListDataType, TagsListDataType } from "@/app/process-list/types"
import { message } from "antd"
import { reqPutEBS } from "@/app/ebs-profession/ebs-data/api"
import { TypeEBSDataList } from "@/app/ebs-profession/ebs-data/types"
import EBSDataContext from "@/app/ebs-profession/ebs-data/context/ebsDataContext"

type Props = {
  open: boolean
  handleCloseDialogAddForm: () => void
  item: TypeEBSDataList
  cb: (processList: ProcessListDataType[], tags: string[]) => void
}

export default function DialogApplyProcess(props: Props) {
  const { open, handleCloseDialogAddForm, item, cb } = props

  const ctx = React.useContext(EBSDataContext)

  const [processList, setProcessList] = React.useState<ProcessListDataType[]>([])

  const { trigger: getTagsListApi } = useSWRMutation("/tag", reqGetTagsList)

  const { trigger: getProcessApi } = useSWRMutation("/process", reqGetProcess)

  const { trigger: putEBSApi } = useSWRMutation("/ebs", reqPutEBS)

  const [tagsList, setTagsList] = React.useState<TagsListDataType[]>([])

  const [tagState, setTagState] = React.useState("null")

  const getTagsListData = async () => {
    const res = await getTagsListApi({})
    setTagsList(res)
  }

  React.useEffect(() => {
    getTagsListData()
  }, [])

  const getProcessListData = async (tags: string) => {
    const res = await getProcessApi({ tags })
    setProcessList(res ?? [])
  }

  const handleChangeSelect = (value: string) => {
    setTagState(value)
    getProcessListData(JSON.stringify([value]))
  }

  const handleSave = async () => {
    if (tagState == "null") return
    let tags = [...JSON.parse(item.tags), tagState]
    await putEBSApi({ ...item, tags: JSON.stringify(tags) } as any)
    message.success("保存成功，已同步到用户端")
    cb(processList, tags)
    const parentIndexArr = item.key?.split("-").slice(0, item.key?.split("-").length - 1)
    ctx.handleGetParentChildren(parentIndexArr as string[])
    handleCloseDialogAddForm()
  }

  return (
    <>
      <Dialog
        onClose={handleCloseDialogAddForm}
        open={open}
        sx={{ zIndex: 1700, ".MuiPaper-root": { maxWidth: "none" } }}>
        <DialogTitle>关联工序</DialogTitle>
        <DialogContent
          sx={{
            width: "40vw",
            minHeight: "40vh",
            maxHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}>
          <div className="flex-1 border px-6 flex flex-col overflow-hidden gap-y-3">
            <div className="flex items-center">
              <InputLabel htmlFor="name" className="mr-3  text-left mb-2.5">
                工序标签名称：
              </InputLabel>
              <Select
                className="w-52"
                size="small"
                value={tagState}
                MenuProps={{ sx: { zIndex: 1703 } }}
                onChange={(event) => {
                  handleChangeSelect(event.target.value as string)
                }}>
                <MenuItem value={"null"} disabled>
                  <i className="text-railway_gray">请选择一个标识</i>
                </MenuItem>
                {tagsList.map((tag) => (
                  <MenuItem key={tag.flag} value={tag.flag}>
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="bg-[#f2f2f2] flex-1 overflow-auto custom-scroll-bar">
              <div>包含工序：</div>
              <div className="p-4 h-full ">
                <ul className="grid grid-cols-4 gap-2 ">
                  {processList.map((item) => (
                    <li key={item.id}>{item.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <DialogActions>
            <Button onClick={handleCloseDialogAddForm}>取消</Button>
            <Button
              variant="contained"
              onClick={() => {
                handleSave()
              }}>
              保存
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  )
}
