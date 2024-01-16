"use client"
import React from "react"
import { Breadcrumbs, Button, InputBase, MenuItem, Select } from "@mui/material"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import Loading from "@/components/loading"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import AddOrEditProcess from "@/app/process-list/components/AddOrEditProcess"
import DialogProcessForm from "@/app/process-list/components/DialogProcessForm"
import useDialogAddOrEditLossCoefficient from "@/app/material-loss-coefficient/hooks/useDialogAddOrEditLossCoefficient"
import AddOrEditLossCoefficient from "@/app/material-loss-coefficient/components/AddOrEditLossCoefficient"

const columns = [
  {
    title: "损耗系数名称",
    key: "损耗系数名称",
  },
  {
    title: "工程专业",
    key: "工程专业",
  },
  {
    title: "类别/加工类型",
    key: "类别/加工类型",
  },
  {
    title: "损耗系数%",
    key: "损耗系数%",
  },
  {
    title: "损耗类型",
    key: "损耗类型",
  },
  {
    title: "是否用于混凝土",
    key: "是否用于混凝土",
  },
  {
    title: "是否用于砂浆",
    key: "是否用于砂浆",
  },
  {
    title: "相关信息",
    key: "相关信息",
  },

  {
    title: "操作",
    key: "action",
  },
]

function MaterialLossCoefficientPage() {
  const { open, handleAddLossCoefficient, handleCloseDialogLossCoefficient } =
    useDialogAddOrEditLossCoefficient()

  return (
    <>
      <h3 className="font-bold text-[1.875rem]">损耗系数管理</h3>
      <div className="mb-9 mt-7">
        <Breadcrumbs aria-label="breadcrumb" separator=">">
          <Link underline="hover" color="inherit" href="/dashboard">
            <i className="iconfont icon-homefill" style={{ fontSize: "14px" }}></i>
          </Link>
          <Typography color="text.primary" sx={{ fontSize: "14px" }}>
            损耗系数管理
          </Typography>
        </Breadcrumbs>
      </div>
      <header className="flex justify-between mb-4">
        <div className="flex gap-x-2">
          <InputBase
            className="w-[12rem] h-10 border  px-2 shadow bg-white"
            placeholder="请输入损耗系数名称"
            onChange={(event) => {}}
          />

          <Select
            sx={{ width: 150 }}
            id="status"
            size="small"
            fullWidth
            onChange={(event) => {}}
            defaultValue="none">
            <MenuItem value={"none"}>请选择工程专业</MenuItem>
          </Select>

          <Select
            sx={{ width: 150 }}
            id="status"
            size="small"
            fullWidth
            onChange={(event) => {}}
            defaultValue="none">
            <MenuItem value={"none"}>请选择类别</MenuItem>
          </Select>
          <Button className="bg-railway_blue text-white" onClick={() => {}}>
            搜索
          </Button>
        </div>
        <div>
          <Button
            className="bg-railway_blue text-white"
            onClick={() => {
              handleAddLossCoefficient()
            }}>
            添加损耗系数
          </Button>
        </div>
      </header>
      {false ? (
        <Loading />
      ) : (
        <div className="flex-1 bg-white overflow-hidden">
          <div className="h-full relative border">
            <div
              className="custom-scroll-bar shadow-sm overflow-y-auto "
              style={{ height: "calc(100% - 32px)" }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
                <TableHead sx={{ position: "sticky", top: "0", zIndex: 5 }}>
                  <TableRow>
                    {columns.map((col, index) => (
                      <TableCell key={index} sx={{ width: col.key == "action" ? "250px" : "auto" }}>
                        {col.title}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="left"></TableCell>
                    <TableCell align="left"></TableCell>
                    <TableCell align="left"></TableCell>
                    <TableCell align="left"></TableCell>
                    <TableCell align="left"></TableCell>
                    <TableCell align="left"></TableCell>
                    <TableCell align="left"></TableCell>
                    <TableCell align="left"></TableCell>
                    <TableCell align="left">
                      <div className="flex gap-x-2">
                        <Button
                          variant="outlined"
                          onClick={() => {}}
                          startIcon={<EditOutlinedIcon />}>
                          编辑
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
      {open && (
        <AddOrEditLossCoefficient
          open={open}
          handleCloseDrawerAddLossCoefficient={handleCloseDialogLossCoefficient}
          editItem={null}
        />
      )}
    </>
  )
}

export default MaterialLossCoefficientPage
