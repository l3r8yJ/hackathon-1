const {Telegraf} = require('telegraf');
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN);

bot
.launch({ port: process.env.PORT })
.then(() => console.log("bot runs!"))
.catch(err => console.error(err))

bot.command('start', async ctx => {
  const greeting = "Hi, i'll notify you!";
  const id = ctx.chat.id;
  bot.telegram.sendMessage(id, greeting).then(() => console.log("message sent to " + id))
})
