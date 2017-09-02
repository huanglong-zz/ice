import cheerio from 'cheerio'
import rp from 'request-promise'
import R from 'ramda'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
// import Agent from 'socks5-http-client/lib/Agent'

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

export const getIMDBCharacters = async () => {
  const options = {
    uri: 'http://www.imdb.com/title/tt0944947/fullcredits?ref_=tt_cl_sm#cast',
    // agentClass: Agent,
    // agentOptions: {
    //   socksHost: 'localhost',
    //   socksPort: 1080
    // },
    transform: body => cheerio.load(body)
  }

  let photos = []

  const $ = await rp(options)
  
  $('table.cast_list tr.odd, tr.even').each(function () {
    const nmIdDom = $(this).find('td.itemprop a')
    const nmId = nmIdDom.attr('href')
    const characterDom = $(this).find('td.character a')
    const name = characterDom.text()
    const chId = characterDom.attr('href')
    const playedByDom = $(this).find('td.itemprop span.itemprop')
    const playedBy = playedByDom.text()

    photos.push({
      nmId,
      chId,
      name,
      playedBy
    })
  })

  console.log('共拿到 ' + photos.length + ' 条数据')
  const fn = R.compose(
    R.map(photo => {
      const reg1 = /\/name\/(.*?)\/\?ref/
      const reg2 = /\/character\/(.*?)\/\?ref/
      const match1 = photo.nmId.match(reg1)
      const match2 = photo.chId.match(reg2)

      photo.nmId = match1[1]
      photo.chId = match2[1]

      return photo
    }),
    R.filter(photo => photo.playedBy && photo.name && photo.nmId && photo.chId)
  )

  photos = fn(photos)

  console.log('清洗后，剩余 ' + photos.length + ' 条数据')

  writeFileSync('./imdb.json', JSON.stringify(photos, null, 2), 'utf8')
}

const fetchIMDbProfile = async (url) => {
  const options = {
    uri: url,
    transform: body => cheerio.load(body)
  }

  const $ = await rp(options)
  const img = $('a[name="headshot"] img')
  let src = img.attr('src')

  if (src) {
    src = src.split('_V1').shift()
    src += '_V1.jpg'
  }

  return src
}

export const getIMDbProfile = async () => {
  const characters = require(resolve(__dirname, '../database/json/wikiCharacters.json'))

  console.log(characters.length)

  for (let i = 0; i < characters.length; i++) {
    if (!characters[i].profile) {
      const url = `http://www.imdb.com/character/${characters[i].chId}/`
      console.log('正在爬取 ' + characters[i].name)
      const src = await fetchIMDbProfile(url)
      console.log('已经爬到 ' + src)

      characters[i].profile = src

      writeFileSync('./imdbCharacters.json', JSON.stringify(characters, null, 2), 'utf8')

      await sleep(500)
    }
  }
}

const checkIMDbProfile = () => {
  const characters = require(resolve(__dirname, '../database/json/imdbCharacters.json'))
  const newCharacters = []

  characters.forEach((item) => {
    if (item.profile) {
      newCharacters.push(item)
    }
  })
  
  writeFileSync(resolve(__dirname, '../database/json/validCharacters.json'), JSON.stringify(newCharacters, null, 2), 'utf8')
}

const fetchIMDbImage = async (url) => {
  const options = {
    uri: url,
    transform: body => cheerio.load(body)
  }

  const $ = await rp(options)
  let images = []

  $('div.media_index_thumb_list a img').each(function () {
    let src = $(this).attr('src')

    if (src) {
      src = src.split('_V1').shift()
      src += '_V1.jpg'
      images.push(src)
    }
  })

  return images
}

export const getIMDbImages = async () => {
  const characters = require(resolve(__dirname, '../database/json/fullCharacters.json'))

  for (let i = 0; i < characters.length; i++) {
    if (!characters[i].images) {
      const url = `http://www.imdb.com/character/${characters[i].chId}/mediaindex`
      console.log('正在爬取 ' + characters[i].name)
      const images = await fetchIMDbImage(url)
      console.log('已经爬到 ' + images.length)

      characters[i].images = images

      writeFileSync(resolve(__dirname, '../database/json/fullCharacters.json'), JSON.stringify(characters, null, 2), 'utf8')

      await sleep(500)
    }
  }
}

getIMDbImages()




