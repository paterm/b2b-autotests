import { Page } from 'puppeteer'
import Logger from './Logger'

export const generateInn = (): string => {
  return (100000000000 + Math.random() * 900000000000).toFixed(0).toString()
}

interface I_FILL_TEXT_FIELD {
  page: Page
  xpath: string
  name: string
  value: string
}

export const fillTextField = async ({ page, xpath, name, value }: I_FILL_TEXT_FIELD) => {
  try {
    const element = await page.waitForXPath(xpath)

    if (!element) {
      return Logger.error({ message: `Element not found: ${name}` })
    }
    await element.focus()
    await element.type(value)
  } catch (e) {
    return Logger.error({ message: `Element error: ${name}` })
  }
}
