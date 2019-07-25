'use strict'

import { createList, renderListDesc, ListCard } from './modules/list-card.js'
import { ListView } from './modules/list-view.js'
import { ListAdd } from './modules/list-add.js'
import { createItem, renderItem, deleteItem } from './modules/items.js'
import { fade, lightUp } from './modules/animate.js'
import { ItemCard, renderListItems } from './modules/item-card.js'

window.customElements.define('list-card', ListCard)
window.customElements.define('list-add', ListAdd)
window.customElements.define('list-view', ListView)
window.customElements.define('item-card', ItemCard)

// let lV = document.createElement('list-card')
// lV.setAttribute('listName', 'First')
// lV.setAttribute('listDesc', 'First Desc')
// lV.setAttribute('listLabel', 'First Label')
// lV.setAttribute('listId', 34)

let lists = document.querySelector('lists')
// lists.appendChild(lV)

let newListVisible = false
let newListB = document.querySelector('#newList')
newListB.addEventListener('click', x => {
  if (!newListVisible) {
    newListB.innerHTML = '-'
    let lA = document.createElement('list-add')
    lA.addEventListener('submitted', x => {
      insertList(x.detail).then(() => {
        document.querySelector('lists').innerHTML = ''
        renderAll()
      })
    })
    // lists.insertBefore(lA, lists.childNodes[0])
    document.querySelector('#createMenu').appendChild(lA)
    newListVisible = true
  } else {
    newListB.innerHTML = '+'
    let lA = document.querySelector('list-add')
    lA.remove()
    newListVisible = false
  }
})

let targetNode = document.querySelector('list-add')

let listsRoot = document.querySelector('lists')

function observeLists (mutations) {
  mutations.forEach(x => {
    if (x.attributeName === 'deleted') {
      let listId = x.target.getAttribute('listid')
      deleteListById(listId * 1).then(x.target.remove())
    } else if (x.attributeName === 'clicked') {
      let listId = x.target.getAttribute('listid')
      document.querySelector('lists').innerHTML = ''
      fetchListById(listId * 1).then(list => renderListItems(list.result))
    }
  })
}

let observer = new MutationObserver(observeLists)

observer.observe(listsRoot, {
  characterData: false,
  attributes: true,
  childList: true,
  subtree: true
})

let db = null

function getNewListData (ld) {
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

let itemData = [ {
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

function getDemoData () {
  let listNames = ['work', 'personal', 'vacation']
  let listItems = [['9', '2', '5'], ['6', 'to', '10'], ['may', 'december', 'july']]
  let listDescs = ['Finish Project', 'looking for inner peace', 'vacate']
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
  return dbProm.then(() => {
    let tx = db.transaction('lists', 'readwrite')
    let store = tx.objectStore('lists')
    list['items'] = itemData.map(x => Object.assign(x, { listId: list.listId }))
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

// insertList(dLists[0])
// insertList(dLists[1])
// insertList(dLists[2])

// console.log(fetchListById('010').then(req => console.log(req.result)))
// console.log(deleteListById(12).then(req => console.log(req)))
// addItemToList('mok', '110').then(() => console.log('keel'))
function renderAll () {
  fetchAllLists().then(ls => ls.forEach(l => renderListDesc(l, deleteListAction)))
}

renderAll()

// renderListItems(item1)
// getDemoData().forEach(x => renderListDesc(x))
// document.querySelector('list-card').animate([
//   { transform: 'scale(1)', opacity: 1, offset: 0 },
//   { transform: 'scale(0.5)', opacity: 0.5, offset: 1 }
// ], {
//   duration: 700,
//   easing: 'ease-in-out',
//   delay: 10,
//   iterations: Infinity,
//   directions: 'alternate',
//   fill: 'forwards'
// })
