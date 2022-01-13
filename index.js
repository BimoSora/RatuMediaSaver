// index.js
require('dotenv').config();
const {Snake} = require("tgsnake") // mengimpor modul.
const FileType = require('file-type');
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
    const url = ctx.text.replace('/url', '').trim();
    if (!url.length) return ctx.telegram.sendMessage(ctx.chat.id, 'No valid url found ')
    await ctx.telegram.sendMessage(ctx.chat.id,'Upload start')
    const buffer = await got(url).buffer()
    const { ext, mime } = await FileType.fromBuffer(buffer)
    let filename2 = ``;
    try {
      filename2 = new URL(url).pathname.split('/').pop();
    } catch (e) {
        console.error(e);
    }
    const allowedFileFormats = ['mp4', 'mp3', '7z', 'zip', 'jpeg', 'jpg', 'gif', 'rar']
    if (allowedFileFormats.includes(ext)) {
      await ctx.telegram.sendDocument(ctx.chat.id,buffer,{
        fileName : filename2
      }, {
      })
      await ctx.telegram.sendMessage(ctx.chat.id,'Upload successful')
    } else {
      ctx.reply('File type not allowed')
    }
  }
})

bot.run()
