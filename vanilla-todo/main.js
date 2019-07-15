import { createList, renderListDesc, ListCard } from './modules/list-card.js'
import { createItem, renderItem, deleteItem } from './modules/items.js'
import { fade, lightUp } from './modules/animate.js'

customElements.define('list-card', ListCard)

let lV = document.createElement('list-card')
lV.setAttribute('listName', 'Kill MeMe')
lV.setAttribute('listDesc', 'killed meme already')
lV.setAttribute('listLabel', 'waste')
lV.setAttribute('listId', 34)

let lists = document.querySelector('lists')
lists.appendChild(lV)

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
    request.onerror = e => {
      reject(e)
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
    lists.push(createList(id * 1 + 10, listNames[id], listItems[id], listDescs[id], listLabels[id]))
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

function fetchAllLists () {
  let dbProm = initDb('VanillaToDo')
  return dbProm.then(e => new Promise((resolve, reject) => {
    let tx = db.transaction('lists', 'readonly')
    let store = tx.objectStore('lists')
    let lists = []
    store.openCursor().onsuccess = e => {
      let cursor = e.target.result
      if (cursor) {
        lists.push(cursor.value)
        cursor.continue()
      }
    }
    tx.oncomplete = e => {
      resolve(lists)
    }
  }))
}

function deleteListAction (event) {
  let id = event.target.parentElement.getAttribute('id')
  document.getElementById(id).remove()
  // event.target.closest('.lists').remove()
  id = id * 1
  deleteListById(id).then(console.log)
}

function deleteListById (listId) {
  let dbProm = initDb('VanillaToDo')
  return dbProm.then(e => new Promise((resolve, reject) => {
    console.log(db)
    let tx = db.transaction('lists', 'readwrite')
    let store = tx.objectStore('lists')
    let req = store.delete(listId)
    tx.oncomplete = e => {
      resolve(req)
    }
    tx.onabort = e => {
      console.log('transaction failed: delete list by id')
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
insertList(dLists[2])

// console.log(fetchListById('010').then(req => console.log(req.result)))
// console.log(deleteListById(12).then(req => console.log(req)))
// addItemToList('mok', '110').then(() => console.log('keel'))
fetchAllLists().then(ls => ls.forEach(l => renderListDesc(l, deleteListAction)))
// getDemoData().forEach(x => renderListDesc(x))
