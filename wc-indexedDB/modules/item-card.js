import { fade, lightUp } from './animate.js'

class ItemCard extends HTMLElement {
  constructor () {
    super()
    this.sRoot = this.attachShadow({ mode: 'open' })
  }

  render (itemId, itemName, itemNotes, itemPriority, itemLabel, itemStatus) {
    let bgColor = 'yellow'
    if (itemPriority === 'High') bgColor = 'red'
    if (itemPriority === 'Medium') bgColor = 'yellow'
    if (itemPriority === 'Low') bgColor = 'green'
    let template = document.createElement('template')
    if (itemNotes === 'null') itemNotes = 'Add Notes'
    let tempStr = String.raw`
      <div class="itemC" id="${itemId}">
        <div class="itemHead">
          <div class="grid-item">
          </div>
          <input class="status grid-item" type="checkbox" done="${itemStatus}"> </input>
          <div class="name grid-item">
            <h2 class="itemNameHeader" >${itemName} </h2> 
          </div>
          <button id="nameEditButton" class="grid-item" type="submit">✎</button>
          <button class="grid-item" type="button" id="deleteItemButton">X</button>
        </div>
        <input id="toggle" type="checkbox">
        <label for="toggle"> ⌄ </label>
        <div id="expand">
          <div class="itemNotes">
            <p> Notes </p>
            <div class="notes"> <p class="item-notes"> ${itemNotes} </p> </div>
          </div>
          <!-- p> Priority: ${itemPriority} </p>
            <p> Label: ${itemLabel} </p>
            <input name="colorpick" type="color" / !-->
        </div>
      </div>
    `

    template.innerHTML = tempStr

    const style = document.createElement('style')

    style.textContent = `
    .grid-item {
        display: inline-block;
    }

    .itemHead {
        text-align: left;
        width: 80%
        border-bottom: 2px solid gray;
    }

    #nameEditButton {
    }

    #deleteItemButton {
        text-align: right;
    }

    .status {
        border: 3px solid red;
        height: 20px;
        width: 20px;
        text-decoration: line-through;
    }

    .item-notes::after {
        content: '✎ ';
    }

    input#toggle {
        display: none;
    }

    #expand {
        height: 0px;
        overflow: auto;
    }

    div.itemC {
        min-width: 300px;
        padding: 20px;
        margin: 10px;
        border: 0px solid gray;
    }

    div.itemC:hover {
    }

    label {
        color: #666;
        font-size: 30px;
    }

    label:hover {
        color: #000;
    }

    #toggle:checked ~ #expand {
      height: auto;
    }

    button {
        width: 40px;
        height: 46px;
        background-color: transparent;
        border: 0px solid gray;
        font-size: 20px;
        color: gray;
    }
    `
    this.sRoot.appendChild(style)
    let clone = document.importNode(template.content, true)
    let statusCheckBox = clone.querySelector('input.status')
    statusCheckBox.addEventListener('click', e => {
      if (e.target.checked) {
        this.setAttribute('done', 'true')
        this.toggleDone(true)
      } else {
        this.setAttribute('done', 'false')
        this.toggleDone(false)
      }
    })
    let theButton = clone.querySelector('#deleteItemButton')
    theButton.addEventListener('click', e => {
      this.setAttribute('deleted', 'true')
    })
    let notes = clone.querySelector('.notes')
    this.noteEditToggle = false
    notes.addEventListener('click', e => {
      if (this.noteEditToggle === false) {
        this.noteEditToggle = true
        this.toggleNoteEdit(true)
      }
    })

    let name = clone.querySelector('.name')
    this.nameEditToggle = false
    let nameEditButton = clone.querySelector('#nameEditButton')
    nameEditButton.addEventListener('click', e => {
      this.setAttribute('editName', 'true')
      if (this.nameEditToggle === false) {
        this.nameEditToggle = true
        this.toggleNameEdit(true)
      }
    })

    this.sRoot.appendChild(clone)
    if (statusCheckBox.getAttribute('done') === 'true') {
      this.toggleDone(true)
      this.sRoot.querySelector('input.status').setAttribute('checked', 'true')
    }
  }

  connectedCallback () {
    let itemId = this.getAttribute('itemId')
    let itemName = this.getAttribute('itemName')
    let itemNotes = this.getAttribute('itemNotes')
    let itemLabel = this.getAttribute('itemLabel')
    let itemPriority = this.getAttribute('itemPriority')
    let itemStatus = this.getAttribute('done')
    this.render(itemId, itemName, itemNotes, itemPriority, itemLabel, itemStatus)
  }

  toggleNoteEdit (e) {
    if (e && this.noteEditToggle) {
      let notes = this.sRoot.querySelector('.notes')
      let oldItemNotes = this.getAttribute('itemNotes')
      if (oldItemNotes === 'null') oldItemNotes = ''
      notes.innerHTML = String.raw`
      <input type="text" id="editNotes" value="${oldItemNotes}"></input>
      `
      let noteInp = this.sRoot.querySelector('#editNotes')
      noteInp.addEventListener('keyup', e => {
        if (e.keyCode === 13) {
          this.noteEditToggle = false
          this.setAttribute('itemNotes', noteInp.value)
        }
      })
    }
  }

  toggleNameEdit (e) {
    if (e && this.nameEditToggle) {
      let notes = this.sRoot.querySelector('.name')
      notes.innerHTML = String.raw`
      <textarea id="editName" cols="40" rows="1">${this.getAttribute('itemName')}</textarea>
      `
      let nameInp = this.sRoot.querySelector('#editName')
      nameInp.addEventListener('keyup', e => {
        if (e.keyCode === 13) {
          this.nameEditToggle = false
          this.setAttribute('itemName', nameInp.value)
        }
      })
    }
  }

  toggleDone (done) {
    if (done) {
      this.sRoot.querySelector('h2.itemNameHeader').innerHTML = String.raw`
      <strike> ${this.getAttribute('itemName')} </strike>
      `
    } else {
      this.sRoot.querySelector('h2.itemNameHeader').innerHTML = String.raw`
       ${this.getAttribute('itemName')}
       `
    }
  }

  attributeChangedCallback (name, newValue, oldValue) {
    if (name === 'done') {
      let itemId = this.getAttribute('itemId')
      let attrs = {
        itemId: itemId
      }
      this.dispatchEvent(new CustomEvent('done', { detail: attrs }))
    }

    if (name === 'deleted') {
      let itemName = this.getAttribute('item-name')
      let itemNotes = this.getAttribute('item-notes')
      let itemPriority = this.getAttribute('item-priority')
      let itemLabel = this.getAttribute('item-label')
      let attrs = {
        'itemId': Math.floor((Math.random() * 1000)),
        'name': itemName,
        'item-notes': itemNotes,
        'item-priority': itemPriority,
        'label': itemLabel
      }
      this.dispatchEvent(new CustomEvent('deleted', { detail: attrs }))
    }
  }

  static get observedAttributes () { return ['deleted', 'done'] }
}

function renderItemDesc (item, deleteItemAction) {
  let iV = document.createElement('item-card')
  iV.setAttribute('itemName', item.name)
  iV.setAttribute('itemNotes', item.notes)
  iV.setAttribute('itemLabel', item.label)
  iV.setAttribute('itemId', item.itemId)
  iV.setAttribute('itemPriority', item.priority)
  iV.setAttribute('done', item.done)
  let itemV = document.querySelector('items')
  itemV.appendChild(iV)
}

let createItem = (id, name, notes, label, priority) => {
  return {
    itemId: id,
    name: name,
    notes: notes,
    priority: priority,
    label: label
  }
}

export { createItem, renderItemDesc, ItemCard }
