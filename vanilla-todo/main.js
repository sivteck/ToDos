import { createList, renderListDesc, removeListDescs } from './modules/lists.js'
import { createItem } from './modules/items.js'

let db = null

function initDb (name) {
  return new Promise((resolve, reject) => {
    if (db !== null) {
      resolve()
      return
    }
    let request = window.indexedDB.open(name, 1)
    request.onupgradeneeded = e => {
      db = e.target.result
      let store = db.createObjectStore('lists', { keyPath: 'listId' })
      let nameIndex = store.createIndex('by_name', 'name')
      let labelIndex = store.createIndex('by_label', 'label')
    }
    request.onsuccess = e => {
      db = e.target.result
      resolve()
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

function insertList (list) {
  let dbProm = initDb('VanillaToDo')
  dbProm.then(() => {
    let tx = db.transaction('lists', 'readwrite')
    let store = tx.objectStore('lists')
    store.put(list)
  })
}

function fetchListById (listId) {
  let dbProm = initDb('VanillaToDo')
  return dbProm.then(e => new Promise((resolve, reject) => {
    let tx = db.transaction('lists', 'readonly')
    let store = tx.objectStore('lists')
    let req = store.get(listId)
    tx.oncomplete = e => {
      resolve(req)
    }
  }))
}

function deleteListById (listId) {
  let dbProm = initDb('VanillaToDo')
  return dbProm.then(e => new Promise((resolve, reject) => {
    let tx = db.transaction('lists', 'readwrite')
    let store = tx.objectStore('lists')
    let req = store.delete(listId)
    tx.oncomplete = e => {
      resolve(req)
    }
  }))
}

function addItemToList (item, listId) {
  let dbProm = initDb('VanillaToDo')
  return dbProm.then(e => new Promise((resolve, reject) => {
    fetchListById(listId).then(req => {
      let listR = req.result
      let items = listR['items']
      items.push(item)
      listR.items = items
      let tx = db.transaction('lists', 'readwrite')
      let store = tx.objectStore('lists')
      store.put(listR)
      tx.oncomplete = e => {
        resolve()
      }
    })
  }))
}

insertList(dLists[0])
insertList(dLists[1])

console.log(fetchListById('010').then(req => console.log(req.result)))
console.log(deleteListById('010').then(req => console.log(req)))
addItemToList('mok', '110').then(() => console.log('keel'))

getDemoData().forEach(x => renderListDesc(x))
