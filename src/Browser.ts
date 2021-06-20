import puppeteer from 'puppeteer'
import Logger from './Logger'

export default class Browser {
  static browser: puppeteer.Browser
  static page: puppeteer.Page

  static async init() {
    Logger.log({ message: 'Start Browser' })
    const launchOptions = { headless: false, args: [ '--start-maximized' ] }

    this.browser = await puppeteer.launch(launchOptions)
    this.page = await this.browser.newPage()

    await this.page.setViewport({width: 1366, height: 768});
    await this.page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

    return true
  }

  static async close() {
    Logger.log({ message: 'Close Browser' })
    return await this.browser.close();
  }

  static get browserInstance() {
    return this.browser
  }

  static get pageInstance() {
    return this.page
  }
}
