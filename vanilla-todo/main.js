import { createList, renderListDesc, removeListDescs } from './modules/lists.js'
import { createItem } from './modules/items.js'

let db = null

function initDb (name) {
  return Promise((resolve, reject) => {
    if (db) {
      resolve()
      return
    }
    let request = window.indexedDB.open(name, 1)
    request.onupgradeneeded = e => {
      db = e.target.result
    }
  })
}

function getDemoData () {
  let listNames = ['work', 'personal', 'vacation']
  let listItems = [['9', '2', '5'], ['6', 'to', '10'], ['may', 'december', 'july']]
  let listDescs = ['meme kill', 'looking for inner peace', 'vacate']
  let listLabels = ['not urgent', 'urgent', 'gtdo']

  let lists = []

  for (let id in listNames) {
    lists.push(createList(id + 10, listNames[id], listItems[id], listDescs[id], listLabels[id]))
  }
  return lists
}

let dLists = getDemoData()

async function insertList (list) {
  let dbProm = await initDb()
  dbProm.then((dbR) => {
    console.log(dbR)
  }
  )
}

insertList(dLists[0]).then(() => console.log('momomomomo'))

getDemoData().forEach((x) => renderListDesc(x))
