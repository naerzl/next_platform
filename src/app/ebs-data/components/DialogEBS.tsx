import React from "react"
import { Button, Form, Input, Modal, Select, Switch } from "antd"
import { TypeApiPostEBSParams, TypeEBSDataList } from "@/app/ebs-data/types"
import useDebounce from "@/hooks/useDebounce"
import useSWRMutation from "swr/mutation"
import { reqPostEBS, reqPutEBS } from "@/app/ebs-data/api"
import EBSDataContext from "@/app/ebs-data/context/ebsDataContext"
import { Type_Is_system } from "@/app/ebs-data/components/TableTr"
import { ENUM_SUBPARY_CLASS } from "@/libs/const"
import { reqGetSubsection } from "@/app/engineering/api"

interface Props {
  open: boolean
  item: TypeEBSDataList
  // eslint-disable-next-line no-unused-vars
  changeDialogOpen: (open: boolean) => void
  deletedDataList: TypeEBSDataList[]
  addType: Type_Is_system
  isEdit: boolean
  // eslint-disable-next-line no-unused-vars
  changeIsEdit: (edit: boolean) => void
  // eslint-disable-next-line no-unused-vars
  handleGetParentChildren: (parentIndexArr: string[]) => void
}

function DialogEBS(props: Props) {
  const ctx = React.useContext(EBSDataContext)
  const { open, item, changeDialogOpen, isEdit, changeIsEdit, handleGetParentChildren } = props

  const { trigger: postEBSApi } = useSWRMutation("/ebs", reqPostEBS)

  const { trigger: putEBSApi } = useSWRMutation("/ebs", reqPutEBS)

  const { trigger: getSubsectionApi } = useSWRMutation("/subsection", reqGetSubsection)

  const [form] = Form.useForm()
  // 弹窗取消事件
  const handleCancel = () => {
    form.resetFields()
    changeDialogOpen(false)
    changeIsEdit(false)
    setApiParams({ is_loop: "no" } as TypeApiPostEBSParams)
  }

  const [apiParams, setApiParams] = React.useState<TypeApiPostEBSParams>({
    is_loop: "no",
    subpart_class: "",
  } as TypeApiPostEBSParams)

  // 提交表单事件（防抖）
  const { run: onFinish } = useDebounce(async (value: any) => {
    if (isEdit) {
      await putEBSApi(
        Object.assign(apiParams, { id: item.id, name: item.name, unit: item.unit }, value),
      )
      const parentIndexArr = item.key?.split("-").slice(0, item.key?.split("-").length - 1)
      handleGetParentChildren(parentIndexArr as string[])
    } else {
      await postEBSApi(Object.assign(apiParams, value, { parent_id: item.id }))
      // 添加
      ctx.handleExpandChange(true, item)
    }
    handleCancel()
  })

  React.useEffect(() => {
    if (isEdit) {
      form.setFieldValue("name", item.name)
      form.setFieldValue("unit", item.unit)
      form.setFieldValue("subpart_class", item.subpart_class)
      form.setFieldValue("h_subpart_code", item.h_subpart_code)
      form.setFieldValue("n_subpart_code", item.n_subpart_code)
      setApiParams((pre) => ({ ...pre, is_loop: item.is_loop ? item.is_loop : "no" }))
      getHighOrNormalSpeed(item.subpart_class)
    }
  }, [isEdit])

  // 处理滑块切换时间
  const handleSwitchChange = (value: boolean) => {
    setApiParams((pre) => ({ ...pre, is_loop: value ? "yes" : "no" }))
  }

  const [highSpeed, setHighSpeed] = React.useState<any[]>([])
  const [normalSpeed, setNormalSpeed] = React.useState<any[]>([])

  const getHighOrNormalSpeed = (subpart_class: string) => {
    getSubsectionApi({ subpart_class, is_highspeed: 1 }).then((res) => {
      setHighSpeed(
        res.map((item) => ({
          ...item,
          value: item.code,
          label: `${item.class_name ? item.class_name + "-" : ""}${
            item.parent_name ? item.parent_name + "-" : ""
          }${item.name}`,
        })),
      )
    })
    getSubsectionApi({ subpart_class, is_highspeed: 0 }).then((res) => {
      setNormalSpeed(
        res.map((item) => ({
          ...item,
          value: item.code,
          label: `${item.class_name ? item.class_name + "-" : ""}${
            item.parent_name ? item.parent_name + "-" : ""
          }${item.name}`,
        })),
      )
    })
  }

  React.useEffect(() => {
    if (apiParams.subpart_class) {
      getHighOrNormalSpeed(apiParams.subpart_class)
    }
    form.resetFields(["h_subpart_code", "n_subpart_code"])
  }, [apiParams.subpart_class])

  //  系统添加的 表单
  const renderForm = () => (
    <Form onFinish={onFinish} form={form} className="ebs_data" labelCol={{ span: 4, offset: 0 }}>
      {!(isEdit && item.is_system == "system") && (
        <>
          <Form.Item
            rules={[{ required: true, message: "请输入名称" }]}
            name="name"
            label="EBS名称:">
            <Input placeholder="请输入名称" size="large"></Input>
          </Form.Item>
          <Form.Item rules={[{ required: true, message: "请输入单位" }]} name="unit" label="单位:">
            <Input placeholder="请输入单位" size="large"></Input>
          </Form.Item>
        </>
      )}
      <div className="mb-6 flex items-center">
        <div className="my-2">是否可循环：</div>
        <Switch
          className="bg-[#bfbfbf]"
          checked={apiParams.is_loop == "yes" ? true : false}
          onChange={handleSwitchChange}
        />
      </div>
      <Form.Item name="subpart_class" label="节点类型">
        <Select
          placeholder="请选择分部分项类型"
          size="large"
          options={ENUM_SUBPARY_CLASS}
          onChange={(value) => {
            setApiParams((pre) => ({ ...pre, subpart_class: value }))
          }}></Select>
      </Form.Item>
      {form.getFieldValue("subpart_class") != "examination" &&
        Boolean(form.getFieldValue("subpart_class")) && (
          <>
            <Form.Item name="h_subpart_code" label="高速编码">
              <Select
                placeholder="请输入高速分部分项code"
                size="large"
                options={highSpeed}></Select>
            </Form.Item>
            <Form.Item label="普速编码" name="n_subpart_code">
              <Select
                placeholder="请输入普速分部分项code"
                size="large"
                options={normalSpeed}></Select>
            </Form.Item>
          </>
        )}
      <Form.Item>
        <div className="flex justify-end gap-2.5">
          <Button onClick={handleCancel}>取消</Button>
          <Button type="primary" className="bg-railway_blue" htmlType="submit">
            确定
          </Button>
        </div>
      </Form.Item>
    </Form>
  )

  return (
    <>
      <Modal title={isEdit ? "修改" : "添加"} open={open} footer={null} onCancel={handleCancel}>
        {renderForm()}
      </Modal>
    </>
  )
}

export default DialogEBS
