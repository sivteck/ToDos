import { fade, lightUp } from './animate.js'

class ListCard extends HTMLElement {
  constructor () {
    super()
    let template = document.getElementById('lists-template')
    let templateContent = template.content

    const shadowRoot = this.attachShadow({ mode: 'open' })
      .appendChild(templateContent.cloneNode(true))
  }
}

let createList = (id, name, items, desc, label) => {
  return {
    listId: id,
    name: name,
    items: items,
    desc: desc,
    label: label
  }
}

function renderListCard (list) {

}

function renderListDesc (list, deleteListAction) {
  let template = document.querySelector('#lists-template')
  let lists = document.querySelector('lists')
  let clone = document.importNode(template.content, true)
  let div = clone.querySelector('div')
  let listName = clone.querySelector('h2.list-name')
  let listDesc = clone.querySelector('p.list-desc')
  let listLabel = clone.querySelector('p.list-label')
  let buttonDeleteList = clone.querySelector('button.deleteList')
  div.id = list.listId
  div.onmouseenter = fade
  div.onmouseleave = lightUp
  div.onclick = renderList
  listName.textContent = list.name
  listDesc.textContent = list.desc
  listLabel.textContent = list.label
  buttonDeleteList.onclick = deleteListAction
  lists.appendChild(clone)
}

function renderAddList (list, db) {
  let template = document.querySelector('#lists-template')
  let lists = document.querySelector('lists')
  let clone = document.importNode(template.content, true)
  let div = clone.querySelector('div')
  let listName = clone.querySelector('h2.list-name')
  let listDesc = clone.querySelector('p.list-desc')
  let listLabel = clone.querySelector('p.list-label')
  let buttonDeleteList = clone.querySelector('button.deleteList')
  div.id = list.listId
  div.onmouseenter = fade
  div.onmouseleave = lightUp
  div.onclick = renderList
  listName.textContent = list.name
  listDesc.textContent = list.desc
  listLabel.textContent = list.label
  // buttonDeleteList.onclick = deleteListAction
  lists.appendChild(clone)
}

function removeListDescs () {
  let listsRoot = document.querySelector('lists')
  listsRoot.innerHTML = ''
}

function renderList (items) {
}

function updateList (updates) {
}

export { createList, renderListDesc, removeListDescs, updateList, renderList, ListCard }
