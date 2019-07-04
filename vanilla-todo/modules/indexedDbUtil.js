let request = window.indexedDB.open('VanillaToDo')
request.onupgradeneeded = function () {
  let db = request.result
  let store = db.createObjectStore('lists', { keyPath: 'listId' })
  let nameIndex = store.createIndex('by_name', 'name')
  let descIndex = store.createIndex('by_desc', 'desc')
  let labelIndex = store.createIndex('by_label', 'label')

  store.put({ 'listId': 1, 'name': 'meme', 'label': 'red' })
  store.put({ 'listId': 2, 'name': 'momo', 'label': 'green' })
}

let db

request.onsuccess = function () {
  db = request.result
}

// Lists
// id, name, desc, label
// Items
// listId, id, check, name, notes, label, created, scheduled, priority

export { }
