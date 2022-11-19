import {watch} from "chokidar";
import {EventEmitter} from "events";
import {allCached} from "./cache.mjs";

export class Oberver extends EventEmitter {
  constructor(folder, bot) {
    super();
    this.folder = folder
    this.bot = bot
  }

  watchFolder() {
    console.log(
        `[${new Date().toLocaleString()}] Watching for folder changes on: ${this.folder}`
    )
    const watcher = watch(this.folder, { persistent: true })
    watcher.on('add', async path => {
      if (path.includes('.log')) {
        allCached().then(
            ids => ids.forEach(ids => {
              this.bot.telegram.sendMessage(
                  ids,
                  'Log was added!'
              )
            })
        ).catch(
            err => console.error(err)
        )
      }
    })
  }
}