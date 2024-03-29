"use client"
import React from "react"
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined"
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined"
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material"
import { usePathname, useRouter } from "next/navigation"
import SupervisedUserCircleOutlinedIcon from "@mui/icons-material/SupervisedUserCircleOutlined"
import permissionJson from "@/config/permission.json"
import { LayoutContext } from "@/components/LayoutContext"

export const dynamic = "force-dynamic"

const menuList: { [key: string]: any } = {
  commonLibrary: {
    title: "公共库",
    icon: <ArchiveOutlinedIcon />,
    open: false,
    permissionTag: permissionJson.public_library_module_read,
    children: {
      dictionary: {
        path: "/dictionary",
        title: "字典库",
        permissionTag: permissionJson.dictionary_base_member_read,
        open: false,
      },
      // collection: {
      //   path: "/collection",
      //   title: "表结构库",
      //   open: false,npm
      // },
    },
  },
  dataTemplate: {
    title: "数据模板",
    icon: <TuneOutlinedIcon />,
    open: false,
    permissionTag: permissionJson.data_template_module_read,
    children: {
      "ebs-profession": {
        path: "/ebs-profession",
        title: "EBS专业列表",
        open: false,
        permissionTag: permissionJson.list_of_ebs_majors_member_read,
      },
      engineering: {
        path: "/engineering",
        title: "工程专业列表",
        open: false,
        permissionTag: permissionJson.list_of_engineering_majors_member_read,
      },
      processList: {
        path: "/process-list",
        title: "工序设置",
        open: false,
        permissionTag: permissionJson.list_of_engineering_majors_member_read,
      },
      // "design-data-list": {
      //   path: "/design-data-list",
      //   title: "设计数据列表",
      //   open: false,
      // },
      "material-loss-coefficient": {
        path: "/material-loss-coefficient",
        title: "损耗系数管理",
        permissionTag: permissionJson.list_of_engineering_majors_member_read,
        open: false,
      },
    },
  },
  // userManagement: {
  //   title: "用户管理",
  //   icon: <SupervisedUserCircleOutlinedIcon />,
  //   open: false,
  //   children: {
  //     "member-department": {
  //       path: "/member-department",
  //       title: "成员部门",
  //       open: false,
  //     },
  //   },
  // },
  projectManagement: {
    title: "项目管理",
    icon: <AccountBalanceWalletOutlinedIcon />,
    open: false,
    permissionTag: permissionJson.item_management_module_read,
    children: {
      "project-management": {
        path: "/project-management",
        title: "项目管理",
        open: false,
        permissionTag: permissionJson.item_list_member_read,
      },
    },
  },
}

function side() {
  const logo = "/static/images/logo.png"
  const pathName = usePathname()

  const router = useRouter()

  const [openList, setOpen] = React.useState<string[]>([])

  const ctxLayout = React.useContext(LayoutContext)

  function displayWithPermission(tag: string) {
    return ctxLayout.permissionTagList.includes(tag) ? {} : { display: "none" }
  }

  // 处理展开合并方法
  const handleClickOpen = (key: string) => {
    if (openList.includes(key)) {
      setOpen((pre) => pre.filter((item) => item !== key))
    } else {
      setOpen((pre) => [...pre, key])
    }
  }

  const changeIcon = (path: string) => {
    return pathName.startsWith(path) ? (
      <i className="w-2 h-2 rounded-full bg-[#44566c]"></i>
    ) : (
      <i className="w-2 h-2 rounded-full border-2 border-[#44566c]"></i>
    )
  }

  React.useEffect(() => {
    for (const k in menuList) {
      for (const subK in menuList[k].children) {
        const flag = pathName.startsWith(menuList[k].children[subK].path)
        if (flag) {
          setOpen([k])
          return
        }
      }
    }
  }, [])

  const goto = (path: string) => {
    router.push(path)
  }

  return (
    <>
      <List
        sx={{ width: "100%", maxWidth: "15rem", bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            className="h-16 flex items-center gap-1 max-h-16"
            sx={{ fontSize: "24px" }}>
            <img src={logo} alt="" className="w-10 h-10" />
            <div className="text-base font-bold text-railway_303">工程数字化管理系统</div>
          </ListSubheader>
        }>
        {Object.keys(menuList).map((key, index) => (
          <div key={index} style={displayWithPermission(menuList[key].permissionTag)}>
            <ListItemButton
              sx={{ color: "#44566c" }}
              onClick={() => {
                handleClickOpen(key)
              }}>
              <ListItemIcon className="min-w-0 mr-2.5" sx={{ width: "1.5rem", height: "1.5rem" }}>
                {menuList[key].icon}
              </ListItemIcon>
              <ListItemText>{menuList[key].title}</ListItemText>
              {openList.includes(key) ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openList.includes(key)} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {Object.keys(menuList[key].children).map((k, i) => (
                  <ListItemButton
                    key={i}
                    style={displayWithPermission(menuList[key].children[k].permissionTag)}
                    sx={
                      pathName.startsWith(menuList[key].children[k].path)
                        ? { bgcolor: "#eef0f1" }
                        : {}
                    }
                    onClick={() => {
                      goto(menuList[key].children[k].path)
                    }}>
                    <ListItemIcon
                      className="min-w-0 mr-2.5 flex justify-center items-center"
                      sx={{ width: "1.5rem", height: "1.5rem" }}>
                      {changeIcon(menuList[key].children[k].path)}
                    </ListItemIcon>
                    <ListItemText
                      sx={{
                        color: pathName.startsWith(menuList[key].children[k].path)
                          ? "#44566c"
                          : "#8697a8",
                      }}>
                      {menuList[key].children[k].title}
                    </ListItemText>
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </div>
        ))}
      </List>
    </>
  )
}

export default side
