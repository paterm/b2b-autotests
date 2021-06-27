export interface I_LOGGER {
  prefix?: string
  message: string
}

export type T_CATEGORY_SELECT = {
  name: string
  xpath: string
  cssPath: string,
  list: T_CATEGORY_LIST
}

export type T_CATEGORY_LIST = {
  xpath: string
  cssPath: string
  count: number
  lastIndex: number
}
