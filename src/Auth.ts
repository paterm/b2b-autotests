import { Page } from 'puppeteer'
import { fillTextField } from './helpers'
import Logger from './Logger'


export default class Auth {
  public page: Page
  public base: string

  constructor(base: string, page: Page) {
    if (!page) {
      throw new Error('Puppeteer Page:object is not found')
    }
    this.page = page
    this.base = base
  }

  public async login({ login, password }: { login: string, password: string }): Promise<boolean> {
    Logger.log({ message: 'Start Auth' })
    await this.page.authenticate({'username':'1', 'password': '1'})
    await this.page.goto(`${this.base}/login`)
    await fillTextField({
      page: this.page,
      xpath: '//*[@id="email"]',
      name: 'Email',
      value: login
    })
    await fillTextField({
      page: this.page,
      xpath: '//*[@id="password"]',
      name: 'Password',
      value: password
    })

    // Submit button
    const submitBtn = await this.page.waitForXPath('//button[@type="submit"]')

    if (!submitBtn) return false

    await submitBtn.click()
    const response = await this.page.waitForResponse((response) => (
      response.url().includes('/api/token/request')
    ))
    await this.page.waitForNavigation()

    if (response.ok()) {
      Logger.log({ message: 'Success Auth' })
    } else {
      Logger.error({ message: 'Auth Failed' })
    }

    return response.ok()
  }
}
