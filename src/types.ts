export interface I_LOGGER {
  prefix?: string
  message: string
}

export type T_NUMBER_KEY_OBJ = {
  [key: number]: {
    xpath: string
    cssPath: string
    count?: number
    lastIndex?: number
  }
}
