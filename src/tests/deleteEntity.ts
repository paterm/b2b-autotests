import Browser from '../Browser'
import Auth from '../Auth'
import Logger from '../Logger'

require('dotenv').config()

const BASE = process.env.BASE || ''
const USERNAME = process.env.USERNAME || ''
const PASSWORD = process.env.PASSWORD || ''

const DeleteEntitySpec = async () => {
  await Browser.init()
  const page = Browser.pageInstance
  const auth = new Auth(BASE, page)

  await auth.login({
    login: USERNAME,
    password: PASSWORD
  });

  await page.goto(`${BASE}/profile/entity`)
  const deleteBtn = await page.waitForXPath('//*[@id="__next"]/section/div/div[2]/section/form/div[11]/button[3]')

  if (!deleteBtn) {
    return Logger.error({ message: `Element not found: ${deleteBtn}` })
  }
  await deleteBtn.click()
  await deleteBtn.dispose()

  const confirmDeleteBtn = await page.waitForXPath('/html/body/div[3]/div[3]/div/div[2]/button[2]')

  if (!confirmDeleteBtn) {
    return Logger.error({ message: `Element not found: ${confirmDeleteBtn}` })
  }
  await confirmDeleteBtn.click()
  await confirmDeleteBtn.dispose()

  const response = await page.waitForResponse(response => (
    response.url().includes('/store/delete')
  ))

  await page.waitForNavigation()

  Logger.log({ prefix: 'Test Result:', message: response.ok() ? 'Success' : 'Failed' })
  await Browser.close()
  return;
}

export default DeleteEntitySpec
