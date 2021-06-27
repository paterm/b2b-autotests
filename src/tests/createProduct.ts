import Browser from '../Browser'
import Auth from '../Auth'
import Logger from '../Logger'
import { fillTextField, delay } from '../helpers'
import { Page } from 'puppeteer'
import { T_CATEGORY_SELECT } from '../types'

require('dotenv').config()

const BASE = process.env.BASE || ''
const USERNAME = process.env.USERNAME || ''
const PASSWORD = process.env.PASSWORD || ''

const firstSelect: T_CATEGORY_SELECT = {
  name: '1 категория',
  xpath: '//*[@id="category1"]',
  cssPath: '#category1',
  list: {
    xpath: '//*[@id="menu-category1"]/div[3]/ul',
    cssPath: 'ul[aria-labelledby="category1"]',
    count: 0,
    lastIndex: 0
  }
}
const secondSelect: T_CATEGORY_SELECT = {
  name: '2 категория',
  xpath: '//*[@id="category2"]',
  cssPath: '#category2',
  list: {
    xpath: '//*[@id="menu-category2"]/div[3]/ul',
    cssPath: 'ul[aria-labelledby="category2"]',
    count: 0,
    lastIndex: 0
  }
}
const thirdSelect: T_CATEGORY_SELECT = {
  name: '3 категория',
  xpath: '//*[@id="category3"]',
  cssPath: '#category3',
  list: {
    xpath: '//*[@id="menu-category3"]/div[3]/ul',
    cssPath: 'ul[aria-labelledby="category3"]',
    count: 0,
    lastIndex: 0
  }
}

const CreateProducts = async () => {
  await Browser.init()
  const page = Browser.pageInstance
  const auth = new Auth(BASE, page)

  await auth.login({
    login: USERNAME,
    password: PASSWORD
  })


  while (firstSelect.list.lastIndex === 2 || firstSelect.list.lastIndex <= firstSelect.list.count) {
    const createBtn = await page.waitForXPath('//*[@id="__next"]/section/div/div[2]/section/div[1]/div/div[1]/a/button')

    if (!createBtn) {
      return Logger.error({ message: `Element not found: ${createBtn}` })
    }

    await createBtn.click()
    await createBtn.dispose()

    await selectCategories(page)
    await createProduct(page)
  }

  await Browser.close()
  return true
}

export default CreateProducts

async function selectCategories(page: Page) {
    //First select
    const firstList = firstSelect.list
    const secondList = secondSelect.list
    const thirdList = thirdSelect.list

    // Если закончился список 2
    if (secondList.count && secondList.lastIndex === secondList.count - 1) {
      firstList.lastIndex += 1
      secondList.lastIndex = 0
      secondList.count = 0
      thirdList.lastIndex = 0
      thirdList.count = 0
    }

    await selectNextCategory(page, firstSelect)

    if (thirdList.count && thirdList.lastIndex === thirdList.count) {
      secondList.lastIndex += 1
      thirdList.lastIndex = 0
      thirdList.count = 0
    }
    await selectNextCategory(page,  secondSelect)
    await selectNextCategory(page,  thirdSelect)

    thirdList.lastIndex += 1
}

async function selectNextCategory(page: Page, select: T_CATEGORY_SELECT) {
  const categorySelect = await page.waitForXPath(select.xpath)

  if (!categorySelect) {
    return Logger.error({ message: `Element not found: ${categorySelect}` })
  }

  await categorySelect.click()
  await categorySelect.dispose()
  await delay(700)

  const list = select.list

  if (!list.count) {
    const categoryListLength = await page.$$eval(list.cssPath + ' li', els => els.length)

    if (!categoryListLength) {
      return Logger.error({ message: `Not found Elements: ${list.cssPath}` })
    }

    select.list.count = categoryListLength
  }

  const nextElement = await page.waitForXPath(`${list.xpath}/li[${list.lastIndex + 1}]`)

  if (!nextElement) {
    return Logger.error({ message: `Element not found: ${nextElement}` })
  }

  await nextElement.click()
  await nextElement.dispose()
  await delay(700)
  Logger.log({message: `${select.name} ${list.lastIndex} of ${list.count}` })
}

async function createProduct(page: Page) {
  await fillTextField({
    page,
    xpath: '//*[@id="name"]',
    name: 'name',
    value: 'Test Product Name'
  })

  await fillTextField({
    page,
    xpath: '//*[@id="description"]',
    name: 'name',
    value: 'Lorem ipsum dolor sit amet'
  })

  /** Цена за шт */
  const entityTypeSelector = await page.waitForXPath('//*[@id="__next"]/section/div/div[2]/section/form/div[4]/div/div[4]/div')

  if (!entityTypeSelector) {
    return Logger.error({ message: `Element not found: ${entityTypeSelector}` })
  }

  await entityTypeSelector.click()
  await entityTypeSelector.dispose()
  await delay(500)

  const entityTypeListItem = await page.waitForXPath('//*[@id="menu-priceUnit"]/div[3]/ul/li[2]')

  if (!entityTypeListItem) {
    return Logger.error({ message: `Element not found: ${entityTypeListItem}` })
  }

  await entityTypeListItem.click()
  await entityTypeListItem.dispose()
  /** End Цена за штуку */

  /** Brand */
  await fillTextField({
    page,
    xpath: '//*[@id="prop#brand"]',
    name: 'Брэнд',
    value: 'Test Brand'
  })
  /** End Brand */

  /** Country*/
  await fillTextField({
    page,
    xpath: '//*[@id="prop#strana-izgotovitel"]',
    name: 'Страна изготовитель',
    value: 'Россия'
  })
  /** End Country */

  /** Submit */
  await page.$eval('[type="submit"]', (button) => {
    const btn: HTMLButtonElement = button as HTMLButtonElement
    btn.click()
  })

  const response = await page.waitForResponse(response => (
    response.url().includes('/product/create')
  ))

  Logger.log({ prefix: 'Create Product Result:', message: response.ok() ? 'Success' : 'Failed' })

  await page.waitForNavigation()

  return true
}
