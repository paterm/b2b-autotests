import { I_LOGGER } from './types'

export default class Logger {
  static log({ prefix = '***', message }: I_LOGGER): void {
    console.log(prefix, message)
  }

  static error({ prefix = 'Error:', message }: I_LOGGER): void {
    console.error(prefix, message)
  }
}
