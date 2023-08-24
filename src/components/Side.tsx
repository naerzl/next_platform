"use client"
import React from "react"
import { AppstoreOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons"
import type { MenuProps } from "antd"
import { Menu } from "antd"
import { usePathname, useRouter } from "next/navigation"

type MenuItem = Required<MenuProps>["items"][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem
}

const items: MenuProps["items"] = [
  getItem("公共库", "公共库", <AppstoreOutlined className="text-base" />, [
    getItem("数据字典", "/dictionary/"),
    getItem("表结构库", "/collection/"),
  ]),

  getItem("模板库", "模板库", <SettingOutlined className="text-base" />, [
    getItem("EBS专业列表", "/ebs-profession/"),
    getItem("设计数据列表", "/design-data-list/"),
    getItem("工程专业列表", "/engineering/"),
  ]),
]

const MenuList: { [key: string]: string[] } = {
  公共库: ["/dictionary/", "/collection/"],
  模板库: ["/ebs-profession/", "/design-data-list/", "/engineering/"],
}

interface Props {
  collapsed: boolean
}

function Side(props: Props) {
  const router = useRouter()
  const pathName = usePathname()
  const { collapsed } = props

  const handleMenuSelect: MenuProps["onSelect"] = (e) => {
    router.push(e.key)
  }

  const [defaultOpenKey, setDefaultOpenKey] = React.useState([""])
  React.useEffect(() => {
    for (const key in MenuList) {
      if (MenuList[key].includes(pathName)) {
        setDefaultOpenKey([key])
        break
      }
    }
  }, [])

  return (
    <>
      <div className="w-full h-16 flex items-center  justify-center px-4 gap-x-1.5">
        <img src={"/static/images/logo.png"} alt="" className="w-10 h-10" />
        {!collapsed && (
          <div className="text-base font-bold text-railway_303">工程数字化管理系统</div>
        )}
      </div>
      <Menu
        inlineCollapsed={collapsed}
        className="text-base"
        openKeys={defaultOpenKey}
        selectedKeys={[pathName]}
        mode="inline"
        items={items}
        onSelect={handleMenuSelect}
        onOpenChange={(openKeys) => {
          setDefaultOpenKey(openKeys)
        }}
      />
    </>
  )
}

export default Side
