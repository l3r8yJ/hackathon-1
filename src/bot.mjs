import {Telegraf} from "telegraf";
import {config} from "dotenv";
import {deleteFromCache, toCache} from "./cache.mjs";
import {Observer} from "./observer.mjs";

function commands(bot) {
  bot.command('start', async ctx => {
    const greeting = "Hi, i'll notify you!";
    const id = ctx.chat.id;
    toCache(ctx.name, id).then(() => {
      bot.telegram.sendMessage(id, greeting).then(
          () => console.log("Message sent to " + id)
      )
    })
  })
  bot.command('off', async ctx => {
    const id = ctx.chat.id;
    deleteFromCache(id).then(
        () => {
          bot.telegram.sendMessage(id, 'Notifications turned off.').then(
              () => console.log('Notifications turned off for: ' + id)
          )
        }
    )
  })
}

export const app = () => {
  config()
  const bot = new Telegraf(process.env.BOT_TOKEN);
  bot.launch({port: process.env.PORT})
  .then(
      () => {
        console.log("Bot runs!")
      }
  )
  .catch(err => console.error(err))
  commands(bot);
  const obs = new Observer('../.data', bot)
  obs.watchFolder();
}
