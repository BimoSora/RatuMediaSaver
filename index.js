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

bot.on('url', async ctx => {
  const url = ctx.text.replace('/url', '').trim()
  if (!url) return ctx.telegram.sendMessage(chatId, 'No valid url found')
  const filename = url.split('/').pop()
  const buffer = await got(url).buffer()
  await ctx.telegram.sendDocument(ctx.chat.id,buffer,{
    fileName : filename
  })
  await ctx.telegram.sendMessage(ctx.chat.id,`Upload successful.`);
})

bot.run()
