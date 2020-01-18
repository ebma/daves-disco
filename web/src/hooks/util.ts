import React from "react"
import _, { DebounceSettings } from "lodash"

export function useDebounce(func: (...args: any) => any, wait = 200, options?: DebounceSettings) {
  return React.useCallback(_.debounce(func, wait, options), [func, wait, options])
}
