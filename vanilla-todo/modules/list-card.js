import { fade, lightUp } from './animate.js'

class ListCard extends HTMLElement {
  constructor () {
    super()
  }

  render (listId, listName, listDesc, listLabel) {
    let template = document.createElement('template')
    let tempStr = String.raw`
      <div class="listV">
        <h2 class="listNameHeader"><slot name="list-name">${listName}</slot></h2>
        <input type="text"> </input>
        <p> <slot name="list-desc">${listDesc}</slot> </p>
        <p> <slot name="list-label">${listLabel}</slot> </p>
        <p> <slot name="list-delete">${listId}</slot> </p>
      </div>
    `
    template.innerHTML = tempStr
    let templateContent = template.content

    const shadowRoot = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')

    style.textContent = `
    div.listV {
        padding: 20px;
        margin: 10px;
        border: 2px solid red;
        border-radius: 20px;
    }
    div.listV:hover {
        background-color: yellow;
    }
    `
    shadowRoot.appendChild(style)
    let clone = document.importNode(template.content, true)
    let listNameHeader = clone.querySelector('h2.listNameHeader')
    listNameHeader.onclick = this.editListName()
    shadowRoot.appendChild(clone)
  }

  editListName (listId) {
    console.log('killed mememememe')
    console.log(this.shadowRoot)
  }

  connectedCallback () {
    let listId = this.getAttribute('listId')
    let listName = this.getAttribute('listName')
    let listDesc = this.getAttribute('listDesc')
    let listLabel = this.getAttribute('listLabel')
    this.render(listId, listName, listDesc, listLabel)
  }
}

function renderListDesc (list, deleteListAction) {
  let lV = document.createElement('list-card')
  lV.setAttribute('listName', list.name)
  lV.setAttribute('listDesc', list.desc)
  lV.setAttribute('listLabel', list.label)
  lV.setAttribute('listId', list.listId)
  let lists = document.querySelector('lists')
  lists.appendChild(lV)
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

export { createList, renderListDesc, ListCard }
