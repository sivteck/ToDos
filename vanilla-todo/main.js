import { createList, renderListDesc, removeListDescs } from './modules/lists.js'
import { createItem } from './modules/items.js'

// let fade = fade

function getDemoData () {
  let listNames = ['work', 'personal', 'vacation']
  let listDescs = ['meme kill', 'looking for inner peace', 'vacate']
  let listLabels = ['not urgent', 'urgent', 'gtdo']

  let lists = []

  for (let id in listNames) {
    lists.push(createList(id, listNames[id], listDescs[id], listLabels[id]))
  }
  return lists
}
console.log(getDemoData())

getDemoData().forEach((x) => renderListDesc(x))
