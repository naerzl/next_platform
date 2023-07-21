import { useDebounceFn } from "ahooks"
// eslint-disable-next-line no-unused-vars
const useDebounce = (fn: (...arg: any) => any, option?: any) => {
  const { cancel, flush, run } = useDebounceFn(fn, { wait: 500, ...option })
  return {
    cancel,
    flush,
    run,
  }
}
export default useDebounce
