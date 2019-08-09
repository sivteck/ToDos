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
          <input id="statusCheckBox" class="status grid-item" type="checkbox" done="${itemStatus}"> </input>
          <label id="statusCheckBoxLabel" for="statusCheckBox"></label>
          <div class="name grid-item">
            <p class="itemNameHeader grid-item" >${itemName} </p> 
          </div>
          <button class="grid-item" type="button" id="deleteItemButton">X</button>
          <button id="nameEditButton" class="grid-item" type="submit">✎</button>
        </div>
        <input id="toggle" type="checkbox">
        <label id="lToggle" for="toggle">  </label>
        <div id="expand">
          <div class="itemNotes">
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
    label#lToggle::after {
        font-size: 15px;
        content: '+ Notes';
    }

    .itemC {
        width: 500px;
        border-bottom: 2px solid gray;
        border-right: 2px solid gray;
        border-top: 1px solid gray;
        border-left: 1px solid gray;
        border-radius: 10px;
    }

    .grid-item {
        display: inline;
    }

    .itemNameHeader {
        font: helvetica;
        font-size: 30px;
        color: #34302F;
    }

    .itemHead {
        text-align: left;
        width: 80%
        border-bottom: 2px solid gray;
    }

    input#statusCheckBox {
        display: none; 
    }

    #statusCheckBoxLabel::before {
        font-size: 25px;
        content: '✓';
        color: transparent;
        height: 20px;
        width: 20px;
        border: 2px solid gray;
        border-left: 1px solid gray;
        border-top: 1px solid gray;
        border-radius: 5px;
        padding: 0px;
        margin: 7px;
        color: #e0d8d7;
    }

    #statusCheckBox:checked ~ #statusCheckBoxLabel::before {
        content: '✓';
        color: green;
    }

   #nameEditButton {
        color: teal;
        float: right;
   }

   #deleteItemButton {
        text-align: right;
        color: red;
        float: right;
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
        margin: 10px;
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

    #lToggle {
    }

    #toggle:checked ~ #lToggle::after {
        content: '- Notes';
    }

    button {
        width: 40px;
        height: 46px;
        background-color: transparent;
        border: 0px solid gray;
        font-size: 20px;
        color: gray;
    }

    input {
        min-width: 300px;
        min-height: 40px;
        font-size: 25px;
        color: #34302F;
        border: 2px solid gray;
        border-right: 0px;
        border-left: 0px;
        border-top: 0px;
    }

    textarea {
        min-width: 300px;
        min-height: 40px;
        font-size: 20px;
        border: 2px solid gray;
        border-right: 0px;
        border-left: 0px;
        border-top: 0px;
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
      <textarea type="text" id="editNotes">${oldItemNotes}</textarea>
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
      <input id="editName" value="${this.getAttribute('itemName')}"></input>
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
      this.sRoot.querySelector('p.itemNameHeader').innerHTML = String.raw`
      <strike style="color: #E4D7D4"> ${this.getAttribute('itemName')} </strike>
      `
    } else {
      this.sRoot.querySelector('p.itemNameHeader').innerHTML = String.raw`
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
