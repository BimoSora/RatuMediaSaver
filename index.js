// index.js
require('dotenv').config();
const {Snake} = require("tgsnake");
const got = require('got');

const bot = new Snake({
  apiHash : `${process.env.apiHash}`,
  apiId : `${process.env.apiId}`,
  botToken : `${process.env.botToken}`,
  tgSnakeLog : true,
  logger: `info`
})

//Function
function first_name(ctx){
  return `${ctx.from.firstName ? ctx.from.firstName : ""}`;
}
function last_name(ctx){
  return `${ctx.from.lastName ? ctx.from.lastName : ""}`;
}
function username(ctx){
  return ctx.from.username ? `@${ctx.from.username}` : "";
}
function fromid(ctx){
  return ctx.from.id ? `[${ctx.from.id}]` : "";
}

// bot.generateSession() // aktifkan ini untuk menghasilkan sesi dan nonaktifkan bot.run().

bot.hears(new RegExp(`^[${bot.prefix}](url) (https?:\/\/.*)`,""),async (ctx) => {
  if(ctx.from.id == Number(process.env.ADMIN) || ctx.from.id == Number(process.env.ADMIN1) || ctx.from.id == Number(process.env.ADMIN2) || ctx.from.id == Number(process.env.ADMIN3) || ctx.from.id == Number(process.env.ADMIN4)){
    const url = ctx.text.replace('/url', '').trim()
    //if (!url) return ctx.telegram.sendMessage(chatId, 'No valid url found')
    const filename = url.split('/').pop()
    await ctx.telegram.sendMessage(ctx.chat.id,`Upload start!`)
    const buffer = []
    const stream = got(url).stream()
    stream
    .on('error', () => ctx.sendMessage(chatId, 'An error has occurred'))
    .on('progress', p => console.log(p))
    .on('data', chunk => buffer.push(chunk))
    .on('end', async () => {
      await ctx.telegram.sendDocument(chatId, Buffer.concat(buffer),{
        fileName : filename
      })
      await ctx.telegram.sendMessage(ctx.chat.id,`Upload successful`)
    })
  }
})

bot.run()
