import Browser from '../Browser'
import Auth from '../Auth'
import Logger from '../Logger'
import { fillTextField, generateInn } from '../helpers'

require('dotenv').config()

const BASE = process.env.BASE || ''
const USERNAME = process.env.USERNAME || ''
const PASSWORD = process.env.PASSWORD || ''

const CreateEntitySpec = async () => {
  await Browser.init()
  const page = Browser.pageInstance
  const auth = new Auth(BASE, page)

  await auth.login({
    login: USERNAME,
    password: PASSWORD
  })

  const buttonEl = await page.waitForXPath('/html/body/div[2]/div[3]/div/div[3]/button[2]')

  if (!buttonEl) {
    return Logger.error({ message: `Element not found: ${buttonEl}` })
  }

  await buttonEl.click()
  await buttonEl.dispose()
  await page.waitForNavigation()

  // Полное наименование
  await fillTextField({
    page,
    xpath: '//*[@id="fullName"]',
    name: 'Наименование',
    value: 'test'
  })
  // Краткое наименование
  await fillTextField({
    page,
    xpath: '//*[@id="name"]',
    name: 'Краткое наименование',
    value: 'test'
  })
  // ОГРН наименование
  await fillTextField({
    page,
    xpath: '//*[@id="ogrn"]',
    name: 'ОГРН',
    value: '1231245235413131234'
  })
  // ИНН наименование
  await fillTextField({
    page,
    xpath: '//*[@id="inn"]',
    name: 'ИНН',
    value: generateInn()
  })
  // Статус продавца
  const firstCheckbox = await page.waitForXPath('//input[@type="checkbox"][@name="производитель"]')

  if (!firstCheckbox) {
    return Logger.error({ message: `Element not found: ${firstCheckbox}` })
  }

  await firstCheckbox.click()
  await firstCheckbox.dispose()

  const submitBtn = await page.waitForXPath('//button[@type="submit"]')

  if (!submitBtn) {
    return Logger.error({ message: `Element not found: ${submitBtn}` })
  }

  await submitBtn.click()
  await submitBtn.dispose()

  const response = await page.waitForResponse(response => (
    response.url().includes('/api/admin/store/registration')
  ))
  await page.waitForNavigation()

  Logger.log({ prefix: 'Test Result:', message: response.ok() ? 'Success' : 'Failed' })
  await Browser.close()
  return;
}

export default CreateEntitySpec
