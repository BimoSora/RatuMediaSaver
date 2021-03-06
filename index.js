// index.js
require('dotenv').config();
const {Snake} = require('tgsnake');
const got = require('got');
const youtubedl = require('youtube-dl-exec');

const bot = new Snake({
  apiHash : `${process.env.apiHash}`,
  apiId : `${process.env.apiId}`,
  botToken : `${process.env.botToken}`,
  tgSnakeLog : true,
  logger: `info`
})

//Function
function first_name(ctx){
  return `${ctx.from.firstName ? ctx.from.firstName : ''}`;
}
function last_name(ctx){
  return `${ctx.from.lastName ? ctx.from.lastName : ''}`;
}
function username(ctx){
  return ctx.from.username ? `@${ctx.from.username}` : '';
}
function fromid(ctx){
  return ctx.from.id ? `[${ctx.from.id}]` : '';
}

// bot.generateSession() // aktifkan ini untuk menghasilkan sesi dan nonaktifkan bot.run().

bot.hears(new RegExp(`^[${bot.prefix}](url) (https?:\/\/.*)`,''),async (ctx) => {
  if(ctx.from.id == Number(process.env.ADMIN) || ctx.from.id == Number(process.env.ADMIN1) || ctx.from.id == Number(process.env.ADMIN2) || ctx.from.id == Number(process.env.ADMIN3) || ctx.from.id == Number(process.env.ADMIN4)){
    const url = ctx.text.replace('/url', '').trim();
    const regex = /youtube.com|youtu.be/g;
    const found = url.match(regex);

    let message_id = ctx.id;
    
    if (found == 'youtube.com' || found == 'youtu.be'){
      let args =  ctx.text.split(' ');
      let url = args[1];
      let mention = `@${ctx.from.username}`;
      var dq = '2160';
      let allowed_qualities = ['144','240','360','480','720','1080','1440','2160'];
      if(!url.match(/^(?:https?:)?(?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]{7,15})(?:[\?&][a-zA-Z0-9\_-]+=[a-zA-Z0-9\_-]+)*(?:[&\/\#].*)?$/)) return ctx.telegram.sendMessage(ctx.chat.id,'Enter a valid youtube url',{ replyToMsgId: message_id , parse_mode: 'Markdown'})
      if(args[2] && allowed_qualities.includes(args[2])){
        var dq = `${args[2]}`
        await ctx.telegram.sendMessage(ctx.chat.id,'Processing your video with the chosen quality',{ replyToMsgId: message_id , parse_mode: 'Markdown'})
      }else if(!args[2]){
        await ctx.telegram.sendMessage(ctx.chat.id,'Processing your video with max quality',{ replyToMsgId: message_id , parse_mode: 'Markdown'})
      }else if(args[2] && !allowed_qualities.includes(args[2])){
        await ctx.telegram.sendMessage(ctx.chat.id,'Invalid quality settings chosen , video will be downloaded with highest possible quality',{ replyToMsgId: message_id , parse_mode: 'Markdown'})
      }
      if(ctx.from.username == undefined){
        mention = ctx.from.first_name
      }

  try{
        youtubedl(url, {
          format: `bestvideo[height<=${dq}]+bestaudio/best[height<=${dq}]`,
          dumpSingleJson: true,
          noWarnings: true,
          noCallHome: true,
          noCheckCertificate: true,
          preferFreeFormats: true,
          youtubeSkipDashManifest: true,
        }).then(async output => {
          const filename = `${output.title}.mp4`
          const filename2 = `${output.title}`
          const buffer = []
          const stream = got.stream(output.requested_formats[0].url)
          stream
          .on('error', () => ctx.telegram.sendMessage(ctx.chat.id, 'An error has occurred'))
          .on('progress', p => console.log(p))
          .on('data', chunk => buffer.push(chunk))
          .on('end', async () => {
            await ctx.telegram.sendDocument(ctx.chat.id,Buffer.concat(buffer),{
              fileName : filename,
              caption : filename2
            })
            await ctx.telegram.sendMessage(ctx.chat.id,`Upload successful`)
          })
        })
      }catch (error) {
        console.error(error);
        await ctx.telegram.sendMessage(ctx.chat.id,'***Error occurred, Make sure your sent a correct URL***',{ replyToMsgId: message_id , parse_mode: 'Markdown'})
      }

    }else{

      const filename = url.split('/').pop()

      var exstension2 = filename;
      var regex2 = /\.[A-Za-z0-9]+$/gm
      var filename2 = exstension2.replace(regex2, '');

      var regex3 = /\.[A-Za-z0-9]+$/gm
      var doctext3 = filename.replace(regex3, '');
      var doctext4 = filename.replace(regex3, 'null');

      const words = filename.split('.').pop()

  try{

        if(doctext3 == doctext4){
          await ctx.telegram.sendMessage(ctx.chat.id,`Exstension not found`,{ replyToMsgId: message_id , parse_mode: 'Markdown'})
        }else{
          if(words == 'jpg' || words == 'jpeg' || words == 'png'){
            await ctx.telegram.sendMessage(ctx.chat.id,'Processing your file',{ replyToMsgId: message_id , parse_mode: 'Markdown'})
            const buffer = []
            const stream = got.stream(url)
            stream
            .on('error', () => ctx.telegram.sendMessage(ctx.chat.id, 'An error has occurred'))
            .on('progress', p => console.log(p))
            .on('data', chunk => buffer.push(chunk))
            .on('end', async () => {
              await ctx.telegram.sendPhoto(ctx.chat.id,Buffer.concat(buffer),{
                fileName : filename,
                caption : filename2
              })
              await ctx.telegram.sendMessage(ctx.chat.id,`Upload successful`)
            })
          }else{
            await ctx.telegram.sendMessage(ctx.chat.id,'Processing your file',{ replyToMsgId: message_id , parse_mode: 'Markdown'})
            const buffer = []
            const stream = got.stream(url)
            stream
            .on('error', () => ctx.telegram.sendMessage(ctx.chat.id, 'An error has occurred'))
            .on('progress', p => console.log(p))
            .on('data', chunk => buffer.push(chunk))
            .on('end', async () => {
              await ctx.telegram.sendDocument(ctx.chat.id,Buffer.concat(buffer),{
                fileName : filename,
                caption : filename2
              })
              await ctx.telegram.sendMessage(ctx.chat.id,`Upload successful`)
            })
          }
        }
      }catch (error) {
        console.error(error);
        await ctx.telegram.sendMessage(ctx.chat.id,'***Error occurred, Make sure your sent a correct URL***',{ replyToMsgId: message_id , parse_mode: 'Markdown'})
      }
    }
  }
})

bot.on("document",async(ctx) => {
  console.log(ctx);
//  await ctx.sendDocument(ctx.chat.id,document.fileId,{
//    caption : ctx.caption
//  })
})

bot.run()
