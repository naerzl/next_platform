import { useEffect, useRef, useState } from "react"
// callback 是结束之后要执行什么事情
export default function useCountDown(initCount = 10, callBack = () => {}) {
  const timeId = useRef<{ id: number }>({ id: -1 })
  const [count, setCount] = useState(initCount)

  const start = () => {
    setCount(initCount)
    // setInterval 在node 和 浏览器都有,所以要指定
    timeId.current.id = window.setInterval(() => {
      setCount((count) => count - 1)
    }, 1000)
  }
  useEffect(() => {
    // 清除副作用
    return () => {
      clearInterval(timeId.current.id)
    }
  }, [])

  useEffect(
    () => {
      // 当倒计时为0时 清除定时器
      if (count === 0) {
        clearInterval(timeId.current.id)
        setCount(initCount)
        callBack()
      }
    },
    [count, callBack], // 监听 count
  )

  return { count, start }
}
