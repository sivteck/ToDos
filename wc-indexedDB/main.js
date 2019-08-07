'use strict'

import { ItemAdd } from './modules/item-add.js'
import { createItem, renderItem } from './modules/items.js'
import { ItemCard, renderItemDesc } from './modules/item-card.js'

window.customElements.define('item-card', ItemCard)
window.customElements.define('item-add', ItemAdd)

let iA = document.createElement('item-add')
iA.addEventListener('submitted', x => {
  insertItem(x.detail).then(() => {
    document.querySelector('items').innerHTML = ''
    renderAll()
  })
})
document.querySelector('#createMenu').appendChild(iA)

let itemsRoot = document.querySelector('items')

function observeItems (mutations) {
  mutations.forEach(x => {
    if (x.attributeName === 'done') {
      let itemId = x.target.getAttribute('itemid')
      let itemStatus = x.target.getAttribute('done')
      toggleStatus(itemId, itemStatus)
    }
    if (x.attributeName === 'deleted') {
      let itemId = x.target.getAttribute('itemid')
      deleteItemById(itemId * 1).then(x.target.remove())
    }
    if (x.attributeName === 'itemnotes') {
      document.querySelector('items').innerHTML = ''
      updateItemNotes(x.target.getAttribute('itemid') * 1, x.target.getAttribute('itemnotes')).then(x => renderAll())
    }
    if (x.attributeName === 'itemname') {
      console.log(x.target.getAttribute('itemname'))
      document.querySelector('items').innerHTML = ''
      updateItemName(x.target.getAttribute('itemid') * 1, x.target.getAttribute('itemname')).then(x => renderAll())
    }
  })
}

let observer = new MutationObserver(observeItems)

observer.observe(itemsRoot, {
  characterData: false,
  attributes: true,
  childList: true,
  subtree: true
})

let db = null

function getNewItemData (ld) {
  console.log(ld)
}

function initDb (name) {
  return new Promise((resolve, reject) => {
    if (db !== null) {
      resolve()
      return
    }
    let request = window.indexedDB.open(name, 1)
    request.onupgradeneeded = e => {
      db = e.target.result
      let store = db.createObjectStore('items', { keyPath: 'itemId' })
      let nameIndex = store.createIndex('by_name', 'name')
      let labelIndex = store.createIndex('by_label', 'label')
      let createdIndex = store.createIndex('by_created', 'created')
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
  let itemData = [{
    id: 1,
    check: false,
    name: 'item 1',
    notes: 'demo item 1',
    label: 'demo',
    created: 'date',
    scheduled: 'today',
    priority: 'high',
    child: null
  },
  {
    id: 2,
    check: false,
    name: 'item 2',
    notes: 'demo item 1',
    label: 'demo',
    created: 'date',
    scheduled: 'today',
    priority: 'high',
    child: null
  },
  {
    id: 3,
    check: false,
    name: 'item 3',
    notes: 'demo item 3',
    label: 'demo',
    created: 'date',
    scheduled: 'today',
    priority: 'high',
    child: null
  }]

  return itemData
}

function insertItem (item) {
  let dbProm = initDb('VanillaToDo')
  return dbProm.then(() => {
    let tx = db.transaction('items', 'readwrite')
    let store = tx.objectStore('items')
    store.put(item)
  })
}

function fetchItemById (itemId) {
  let dbProm = initDb('VanillaToDo')
  return dbProm.then(e => new Promise((resolve, reject) => {
    let tx = db.transaction('items', 'readonly')
    let store = tx.objectStore('items')
    let req = store.get(itemId)
    tx.oncomplete = e => {
      resolve(req)
    }
  }))
}

function fetchAllItems () {
  let dbProm = initDb('VanillaToDo')
  return dbProm.then(e => new Promise((resolve, reject) => {
    let tx = db.transaction('items', 'readonly')
    let store = tx.objectStore('items')
    let items = []
    store.openCursor().onsuccess = e => {
      let cursor = e.target.result
      if (cursor) {
        items.push(cursor.value)
        cursor.continue()
      }
    }
    tx.oncomplete = e => {
      items = items.sort(function (i1, i2) {
        if (i1.created < i2.created) return 1
        return -1
      })
      console.log(items)
      resolve(items)
    }
  }))
}

function fetchAllDoneItems () {
  let dbProm = initDb('VanillaToDo')
  return dbProm.then(e => new Promise((resolve, reject) => {
    let tx = db.transaction('items', 'readonly')
    let store = tx.objectStore('items')
    let items = []
    store.openCursor().onsuccess = e => {
      let cursor = e.target.result
      if (cursor) {
        if (cursor.value.done === 'true') items.push(cursor.value)
        cursor.continue()
      }
    }
    tx.oncomplete = e => {
      resolve(items)
    }
  }))
}

function fetchAllIncompleteItems () {
  let dbProm = initDb('VanillaToDo')
  return dbProm.then(e => new Promise((resolve, reject) => {
    let tx = db.transaction('items', 'readonly')
    let store = tx.objectStore('items')
    let items = []
    store.openCursor().onsuccess = e => {
      let cursor = e.target.result
      if (cursor) {
        if (cursor.value.done !== 'true') items.push(cursor.value)
        cursor.continue()
      }
    }
    tx.oncomplete = e => {
      resolve(items)
    }
  }))
}


function deleteItemAction (event) {
  let id = event.target.parentElement.getAttribute('id')
  document.getElementById(id).remove()
  id = id * 1
  deleteItemById(id).then(console.log)
}

function deleteItemById (itemId) {
  let dbProm = initDb('VanillaToDo')
  return dbProm.then(e => new Promise((resolve, reject) => {
    let tx = db.transaction('items', 'readwrite')
    let store = tx.objectStore('items')
    let req = store.delete(itemId)
    tx.oncomplete = e => {
      resolve(req)
    }
    tx.onabort = e => {
      console.log('transaction failed: delete item by id')
    }
  }))
}

function toggleStatus (itemId, itemStatus) {
  let dbProm = initDb('VanillaTodo')
  return dbProm.then(e => new Promise((resolve, reject) => {
    fetchItemById(itemId * 1).then(req => {
      let itemR = req.result
      itemR['done'] = itemStatus
      let tx = db.transaction('items', 'readwrite')
      let store = tx.objectStore('items')
      store.put(itemR)
      tx.oncomplete = e => {
        resolve()
      }
    })
  })
  )
}

function updateItemNotes (itemId, newNote) {
  let dbProm = initDb('VanillaTodo')
  return dbProm.then(e => new Promise((resolve, reject) => {
    fetchItemById(itemId * 1).then(req => {
      let itemR = req.result
      itemR['notes'] = newNote
      let tx = db.transaction('items', 'readwrite')
      let store = tx.objectStore('items')
      store.put(itemR)
      tx.oncomplete = e => {
        resolve()
      }
    })
  }))
}

function updateItemName (itemId, newName) {
  let dbProm = initDb('VanillaTodo')
  return dbProm.then(e => new Promise((resolve, reject) => {
    fetchItemById(itemId * 1).then(req => {
      let itemR = req.result
      itemR['name'] = newName
      let tx = db.transaction('items', 'readwrite')
      let store = tx.objectStore('items')
      store.put(itemR)
      tx.oncomplete = e => {
        resolve()
      }
    })
  })
  )
}
function renderAll () {
  fetchAllItems().then(items => items.forEach(item => renderItemDesc(item, deleteItemAction)))
}

renderAll()
