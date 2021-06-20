import Browser from '../Browser'
import Auth from '../Auth'
import Logger from '../Logger'
import { fillTextField } from '../helpers'
import { Page } from 'puppeteer'
import { T_NUMBER_KEY_OBJ } from '../types'

require('dotenv').config()

const BASE = process.env.BASE || ''
const USERNAME = process.env.USERNAME || ''
const PASSWORD = process.env.PASSWORD || ''

const selectPaths: T_NUMBER_KEY_OBJ = {
  0: {
    xpath: '//*[@id="__next"]/section/div/div[2]/section/form/div[1]/div[2]/div',
    cssPath: '#category1"'
  }
}
const listPaths: T_NUMBER_KEY_OBJ = {
  0: {
    xpath: '//*[@id="menu-category1"]/div[3]/ul',
    cssPath: 'ul[aria-labelledby="category1"]',
    count: 0,
    lastIndex: 0
  }
}

const CreateProduct = async () => {
  await Browser.init()
  const page = Browser.pageInstance
  const auth = new Auth(BASE, page)

  await auth.login({
    login: USERNAME,
    password: PASSWORD
  })

  const createBtn = await page.waitForXPath('//*[@id="__next"]/section/div/div[2]/section/div[1]/div/div[1]/a/button')

  if (!createBtn) {
    return Logger.error({ message: `Element not found: ${createBtn}` })
  }

  await createBtn.click()
  await createBtn.dispose()
  await selectNextCategory(page)
}

export default CreateProduct


async function selectNextCategory(page: Page, categoryType = 0) {
  const categorySelect = await page.waitForXPath(selectPaths[categoryType].xpath)

  if (!categorySelect) {
    return Logger.error({ message: `Element not found: ${categorySelect}` })
  }

  await categorySelect.click()
  const categoryList = await page.$(listPaths[categoryType].cssPath)

  if (!categoryList) {
    return Logger.error({ message: `Element not found: ${categoryList}` })
  }

  if (!listPaths[categoryType].count) {
    console.log('categoryList', categoryList)
    const elements = await categoryList.$$eval('li', (nodes) => nodes.map(i => i))
    console.log('elements.length', elements)
  }
}
