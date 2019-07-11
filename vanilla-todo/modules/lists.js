import { fade, lightUp } from './animate.js'

class ListCard extends HTMLElement {
  constructor () {
    super()
    console.log(this.getAttribute('listName'))
    console.log(this.getAttribute('listDesc'))
    console.log(this.getAttribute('listLabel'))
    console.log(this.getAttribute('listId'))

    let template = document.getElementById('list-card')
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
    `
    shadowRoot.appendChild(style)
    shadowRoot.appendChild(templateContent.cloneNode(true))
    console.log(style.isConnected)
  }
}

function renderListDesc (list, deleteListAction) {
  let listViewElement = String.raw`<list-view listName="${list.name}" listDesc="${list.desc}" listLabel="${list.label}" listId="${list.listId}"> </list-view>`
  let lists = document.querySelector('lists')
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
