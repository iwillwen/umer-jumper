import request from 'request'
import Koa from 'koa'
import url from 'url'

const requestAsync = function(opt) {
  return new Promise((resolve, reject) => {
    request(opt, (err, res, body) => {
      if (err) return reject(err)

      resolve(body)
    })
  })
}

const app = new Koa()

app.use(async function(ctx) {
  let targetUrl = decodeURIComponent(ctx.query.target)

  var urlInfo = url.parse(targetUrl)

  if (urlInfo.query.itemId) {
    urlInfo.query.id = urlInfo.query.itemid
  }

  if (urlInfo.hostname === 'm.tb.cn' || urlInfo.host === 'b.mashort.cn') {
    var body = await requestAsync(targetUrl)
    var location = body.match(/<input type="hidden" id="J_Url" value=\'(.*)\'>/)
    if (location) location = location[1]
    location = body.match(/var url = '(.*)';\r\n/)
    if (location) location = location[1]
    urlInfo = url.parse(location, true)
  }

  if (urlInfo.host === 'b.mashort.cn') {
    let body = await requestAsync(targetUrl)
    location = body.match(/var url = '(.*)';\r\n/)
    targetUrl = body.match(/id="J_Url" value='(.*)'/)[1]
    urlInfo = url.parse(targetUrl, true)
  }

  if (urlInfo.pathname === '/scan/transit-sms.html') {
    targetUrl = unescape(urlInfo.query.url)
    urlInfo = url.parse(targetUrl, true)
  }

  if (urlInfo.hostname === 'tb.cn') {
    let location = (await requestAsync(targetUrl)).headers.location
    urlInfo = url.parse(location, true)
  }

  let source_id = urlInfo.query.id

  if (urlInfo.hostname === 'a.m.taobao.com' && /^\/i(\d+)/i.test(urlInfo.pathname)) {
    source_id = urlInfo.pathname.match(/^\/i(\d+)/i)[1]
  }

  ctx.body = {
    id: source_id
  }
})

app.listen(parseInt(process.env.PORT) || 80)
