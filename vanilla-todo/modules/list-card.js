import { fade, lightUp } from './animate.js'

class ListCard extends HTMLElement {
  constructor () {
    super()
  }

  render (listId, listName, listDesc, listLabel) {
    let template = document.createElement('template')
    console.log(template)
    let tempStr = String.raw`
      <div class="listV">
        <p> Mo Mo Card </p>
        <h2><slot name="list-name">${listName}</slot></h2>
        <p> <slot name="list-desc">${listDesc}</slot> </p>
        <p> <slot name="list-label">${listLabel}</slot> </p>
        <p> <slot name="list-delete">${listId}</slot> </p>
      </div>
    `
    template.innerHTML = tempStr
    let templateContent = template.content
    console.log(template.content)

    const shadowRoot = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')

    style.textContent = `
    div.listV {
        padding: 20px;
        margin: 10px;
        border: 2px solid red;
        border-radius: 20px;
    }
    `
    shadowRoot.appendChild(style)
    shadowRoot.appendChild(templateContent.cloneNode(true))
    console.log(shadowRoot)
    console.log(style.isConnected)

    console.log(listName)
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
