// index.js
require('dotenv').config();
const {Snake} = require("tgsnake") // mengimpor modul.
const FileType = require('file-type');
const got = require('got');

const bot = new Snake({
  apiHash : `${process.env.apiHash}`,
  apiId : `${process.env.apiId}`,
  botToken : `${process.env.botToken}`,
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
bot.command("start", async (ctx)=>{
  await ctx.telegram.sendMessage(ctx.chat.id, "Selamat datang, bot akan memberikan file yang anda berikan.")
})

//check account
bot.command("getid", async (ctx)=>{
  //let results = await ctx.telegram.getUserPhotos(ctx.chat.id)
  await ctx.telegram.sendMessage(ctx.chat.id,`<b>Name:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n<b>Username:</b> ${username(ctx)}\n<b>ID:</b> ${ctx.from.id}`,{
    parseMode:'HTML'
  })
})

bot.hears(new RegExp(`^[${bot.prefix}](url) (https?:\/\/.*)`,""),async ctx => {
  await ctx.telegram.sendDocument(ctx.chat.id,ctx.text)
})

bot.run()