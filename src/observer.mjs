import {watch} from "chokidar";
import {EventEmitter} from "events";
import {allCached} from "./cache.mjs";

export class Observer extends EventEmitter {
  constructor(folder, bot) {
    super();
    this.folder = folder
    this.bot = bot
  }

  watchFolder() {
    console.log(
        `[${new Date().toLocaleString()}] Watching for folder changes on: ${this.folder}`
    )
    const watcher = watch(this.folder, {persistent: true})
    watcher.on('add', async path => {
      if (path.includes('.log')) {
        this.#notifyAllUsers();
      }
    })
  }

  #notifyAllUsers() {
    allCached().then(
        ids => ids.forEach(
            id => {
              this.bot.telegram.sendMessage(
                  id,
                  'Log was added!'
              ).then()
            }
        )
    ).catch(
        err => console.error(err)
    )
  }
}