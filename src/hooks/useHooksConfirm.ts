import { useConfirm } from "material-ui-confirm"

export default function useHooksConfirm() {
  const confirm = useConfirm()

  const handleConfirm = (cbFn: Function, cancelFn?: Function) => {
    confirm({
      title: "你确定要删除吗？",
      confirmationText: "确定",
      cancellationText: "取消",
      dialogProps: {
        sx: { zIndex: 50000 },
      },
      contentProps: {
        sx: {
          width: "400px",
          height: "280px",
        },
      },
    })
      .then(() => {
        cbFn()
      })
      .catch(() => {
        cancelFn && cancelFn()
      })
  }

  return {
    handleConfirm,
  }
}
