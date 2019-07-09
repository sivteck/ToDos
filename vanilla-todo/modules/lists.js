import { fade, lightUp } from './animate.js'
let createList = (id, name, items, desc, label) => {
  return {
    listId: id,
    name: name,
    items: items,
    desc: desc,
    label: label
  }
}

function renderListDesc (list) {
  let template = document.querySelector('#lists-template')
  let lists = document.querySelector('lists')
  let clone = document.importNode(template.content, true)
  let div = clone.querySelector('div')
  let listName = clone.querySelector('h2.list-name')
  let listDesc = clone.querySelector('p.list-desc')
  let listLabel = clone.querySelector('p.list-label')
  let buttonDeleteList = clone.querySelector('button.deleteList')
  div.id = list.id
  div.onmouseenter = fade
  div.onmouseleave = lightUp
  div.onclick = renderList
  listName.textContent = list.name
  listDesc.textContent = list.desc
  listLabel.textContent = list.label
  buttonDeleteList.onclick = deleteList
  lists.appendChild(clone)
}

function addList (list, db) {

}

function removeListDescs () {
  let listsRoot = document.querySelector('lists')
  listsRoot.innerHTML = ''
}

function renderList (items) {
}

function deleteList (buttonDeleteList) {
  let id = buttonDeleteList.target.parentElement.getAttribute('id')
  document.getElementById(id).remove()
}

function updateList (updates) {
}

export { createList, renderListDesc, removeListDescs, deleteList, updateList, renderList }
