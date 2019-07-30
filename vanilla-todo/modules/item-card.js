import { fade, lightUp } from './animate.js'

class ItemCard extends HTMLElement {
  constructor () {
    super()
    this.sRoot = this.attachShadow({ mode: 'open' })
  }

  render (itemId, itemName, itemNotes, itemPriority, itemLabel) {
    let bgColor = 'yellow'
    if (itemPriority === 'High') bgColor = 'red'
    if (itemPriority === 'Medium') bgColor = 'yellow'
    if (itemPriority === 'Low') bgColor = 'green'
    let template = document.createElement('template')
    let tempStr = String.raw`
      <div class="itemC" id="${itemId}">
      <div class="itemHead">
        <input class="status" type="checkbox"> </input>
      </div>
      <div class="itemHead">
        <h2 class="itemNameHeader" >${itemName}</h2>
      </div>
      <br>
     <div class="collapsible-extras">
      <div class="itemNotes">
      <div class="notes"> <p class="item-notes"> ${itemNotes} </p> </div>
      </div>
      <p> Priority: ${itemPriority} </p>
      <p> Label: ${itemLabel} </p>
        <button type="button"> Delete Item</button>
      
      </div>
     </div>
    `

    template.innerHTML = tempStr

    const style = document.createElement('style')

    style.textContent = `
    .itemHead {
        display: inline-block;
    }
    .collapsible-extras {
        display: none;
    }
    .notes {
    
    }
    div.itemC {
        padding: 20px;
        margin: 10px;
        border: 2px solid red;
        border-radius: 20px;
    }
    div.itemC:hover {
        background-color: ${bgColor};
    }
    .extras {
    
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
    let theButton = clone.querySelector('button')
    theButton.setAttribute('meme', 'momo')
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

    this.sRoot.appendChild(clone)
  }

  connectedCallback () {
    let itemId = this.getAttribute('itemId')
    let itemName = this.getAttribute('itemName')
    let itemNotes = this.getAttribute('itemNotes')
    let itemLabel = this.getAttribute('itemLabel')
    let itemPriority = this.getAttribute('itemPriority')
    this.render(itemId, itemName, itemNotes, itemPriority, itemLabel)
  }

  toggleNoteEdit (e) {
    if (e && this.noteEditToggle) {
      let notes = this.sRoot.querySelector('.notes')
      notes.innerHTML = String.raw`
      <textarea id="editNotes" cols="40" rows="5">${this.getAttribute('itemNotes')}</textarea>
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
