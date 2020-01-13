require('dotenv').config()
const linebot = require('linebot')
const rp = require('request-promise')

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

const callAPI = async (usermsg) => {
  let data = ''
  try {
    const str = await rp('https://bsb.kh.edu.tw/afterschool/opendata/afterschool_json.jsp?city=20')
    let json = JSON.parse(str)
    json = json.filter(j => {
      return j['短期補習班名稱'] === usermsg
    })
    if (json.length === 0) data = '找不到資料'
    else data = json[0]['地址']
  } catch (error) {
    data = '錯誤'
  }
  return data
}

bot.listen('/', process.env.PORT, () => {
  console.log('OK')
})

bot.on('message', event => {
  if (event.message.type === 'text') {
    const usermsg = event.message.text
    callAPI(usermsg).then(result => {
      event.reply(result)
    }).catch(() => {
      event.reply('錯誤')
    })
  }
})
