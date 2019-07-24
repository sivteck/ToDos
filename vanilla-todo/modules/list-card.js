import { fade, lightUp } from './animate.js'

class ListCard extends HTMLElement {
  constructor () {
    super()
  }

  render (listId, listName, listDesc, listLabel) {
    let template = document.createElement('template')
    let tempStr = String.raw`
      <div class="listV" id="${listId}">
        <h2 class="listNameHeader" ><slot name="list-name">${listName}</slot></h2>
        <p> <slot name="list-desc">${listDesc}</slot> </p>
        <p> <slot name="list-label">${listLabel}</slot> </p>
        <p> <slot name="list-delete">${listId}</slot> </p>
        <button type="button"> Delete List </button>
      </div>
    `
    template.innerHTML = tempStr
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
    div.listV:hover {
        background-color: yellow;
    }
    `
    shadowRoot.appendChild(style)
    let clone = document.importNode(template.content, true)
    let div = clone.querySelector('div')
    div.addEventListener('click', function (e) {
      this.setAttribute('clicked', 'true')
    }.bind(this))
    let theButton = clone.querySelector('button')
    theButton.setAttribute('meme', 'momo')
    theButton.addEventListener('click', function (e) {
      this.setAttribute('deleted', 'true')
    }.bind(this))

    shadowRoot.appendChild(clone)
  }

  connectedCallback () {
    let listId = this.getAttribute('listId')
    let listName = this.getAttribute('listName')
    let listDesc = this.getAttribute('listDesc')
    let listLabel = this.getAttribute('listLabel')
    this.render(listId, listName, listDesc, listLabel)
  }

  attributeChangedCallback (name, newValue, oldValue) {
    if (name === 'clicked') {
      let listId = this.getAttribute('listId')
      let attrs = {
        listId: listId
      }

      this.dispatchEvent(new CustomEvent('clicked', { detail: attrs }))
    }

    if (name === 'deleted') {
      let listName = this.getAttribute('list-name')
      let listDesc = this.getAttribute('list-desc')
      let listPriority = this.getAttribute('list-priority')
      let listLabel = this.getAttribute('list-label')
      let attrs = {
        'listId': Math.floor((Math.random() * 100)),
        'name': listName,
        'list-desc': listDesc,
        'list-priority': listPriority,
        'label': listLabel
      }
      this.dispatchEvent(new CustomEvent('deleted', { detail: attrs }))
    }
  }

  static get observedAttributes () { return ['deleted', 'clicked'] }
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
