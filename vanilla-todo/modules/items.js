import { fade, lightUp } from './animate.js'

function createItem (listId, id, created, check = false, name = '', notes = '', label = '', scheduled = '', priority = '') {
  return {
    listId: listId,
    id: id,
    check: check,
    name: name,
    notes: notes,
    label: label,
    created: created,
    scheduled: scheduled,
    priority: priority,
    child: null
  }
}

function deleteItem (itemId) {
}

function renderItem (item) {
  let template = document.querySelector('#items-template')
  let items = document.querySelector('items')
  let clone = document.importNode(template.content, true)
  let div = clone.querySelector('div')
  let itemName = clone.querySelector('p.item-name')
  let itemNotes = clone.querySelector('p.item-notes')
  let itemLabel = clone.querySelector('p.item-label')
  let buttonDeleteItem = clone.querySelector('button.deleteItem')
  div.id = item.id
  div.onmouseenter = fade
  div.onmouseleave = lightUp
  div.onclick = renderItem
  itemName.textContent = item.name
  itemNotes.textContent = item.notes
  itemLabel.textContent = item.label
  buttonDeleteItem.onclick = deleteItem
  items.appendChild(clone)
}

export { createItem, deleteItem, renderItem }
