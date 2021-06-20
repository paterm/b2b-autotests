import Browser from '../Browser'
import Auth from '../Auth'
import Logger from '../Logger'

require('dotenv').config()

const BASE = process.env.BASE || '';

(async () => {
  await Browser.init()
  const page = Browser.pageInstance
  const auth = new Auth(BASE, page)

  await auth.login({
    login: 's.efimova@b2btrade.ru',
    password: 'Poiuyt123123'
  });

  /** Test body */

  Logger.log({ prefix: 'Test Result:', message: true ? 'Success' : 'Failed' })
  await Browser.close()
  return;
})()
