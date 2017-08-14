const tip = '我的卡丽熙，欢迎来到河间地\n' +
  '点击 <a href="http://coding.imooc.com">一起搞事情吧</a>'


export default async (ctx, next) => {
  const message = ctx.weixin
  let mp = require('../wechat')
  let client = mp.getWechat()

  const tokenData = await client.fetchAccessToken()

  console.log(tokenData)

  console.log(await client.handle('getUserInfo', message.FromUserName, tokenData.access_token))

  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      ctx.body = tip
    } else if (message.Event === 'unsubscribe') {
      console.log('取关了')
    } else if (message.Event === 'LOCATION') {
      ctx.body = message.Latitude + ' : ' + message.Longitude
    } else if (message.Event === 'view') {
      ctx.body = message.EventKey + message.MenuId
    } else if (message.Event === 'pic_sysphoto') {
      ctx.body = message.Count + ' photos sent'
    }
  } else if (message.MsgType === 'text') {
    if (message.Content === '1') {
      let userList = [
        {
          openid: 'oW4nAvierE42NXIkwU9waetHF8Dg',
          lang: 'zh_CN'
        },
        {
          openid: 'oW4nAvrWhLV05OMSKJBAPOdHoQlE',
          lang: 'zh_CN'
        },
        {
          openid: 'oW4nAvj_FzA2ZV0yUbcCI5bfDf_s',
          lang: 'zh_CN'
        },
        {
          openid: 'oW4nAvoVIJMZh1eWZljDGXRoRwH0',
          lang: 'zh_CN'
        },
        {
          openid: 'oW4nAvql1RPf88TLhdsCAPNYyNQA',
          lang: 'zh_CN'
        },
        {
          openid: 'oW4nAvuIc1zjxy0rSpx9u5bB2-s8',
          lang: 'zh_CN'
        },
        {
          openid: 'oW4nAvinU3XfeQZonHCCrYPUqNu0',
          lang: 'zh_CN'
        },
        {
          openid: 'oW4nAvidymbIkpeR2FwLWy7JKCRU',
          lang: 'zh_CN'
        },
        {
          openid: 'oW4nAvhn9ICAcWtz58_8-lDqcDZM',
          lang: 'zh_CN'
        },
        {
          openid: 'oW4nAvmqvtHWMBmJWGE7gWMMHvKU',
          lang: 'zh_CN'
        },
        {
          openid: 'oW4nAvhO3XMk1uxGPU3ZihlArQew',
          lang: 'zh_CN'
        },
        {
          openid: 'oW4nAvgYiCCZzSa4mnmPr21vBz-0',
          lang: 'zh_CN'
        },
        {
          openid: 'oW4nAvrlwQ0rbX6U9pLksZjLtd3k',
          lang: 'zh_CN'
        },
        {
          openid: 'oW4nAvrOQGvD7Au_BmScor0U82pA',
          lang: 'zh_CN'
        },
        {
          openid: 'oW4nAvpSgoLKfVDdtK_VvGutDako',
          lang: 'zh_CN'
        },
        {
          openid: 'oW4nAvr6tFuyv8pp22NNpp64ypFY',
          lang: 'zh_CN'
        }
      ]
      // const data = await client.handle('createTag', 'VueSSR')
      // const data = await client.handle('fetchTags')
      // const data = await client.handle('batchTag', ['oW4nAvpSgoLKfVDdtK_VvGutDako'], 100)
      const data = await client.handle('getTagList', 'oW4nAvpSgoLKfVDdtK_VvGutDako')
      console.log(data)
    } else if (message.Content === '2') {
      const menu = require('./menu').default
      await client.handle('delMenu')
      const menuData = await client.handle('createMenu', menu)

      console.log(menuData)
    }


    ctx.body = message.Content
  } else if (message.MsgType === 'image') {
    ctx.body = {
      type: 'image',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'voice') {
    ctx.body = {
      type: 'voice',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'video') {
    ctx.body = {
      type: 'video',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'location') {
    ctx.body = message.Location_X + ' : ' + message.Location_Y + ' : ' + message.Label
  } else if (message.MsgType === 'link') {
    ctx.body = [{
      title: message.Title,
      description: message.Description,
      picUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/xAyPZaQZmH09wYBjskFEQSoM4te0SnXR9YgbJxlDPVPDZtgLCW5FacWUlxFiaZ7d8vgGY6mzmF9aRibn05VvdtTw/0',
      url: message.Url
    }]
  }
}