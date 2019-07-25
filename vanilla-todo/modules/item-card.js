// listId, id, check, name, notes, label, created, scheduled, priority
class ItemCard extends HTMLElement {
  constructor () {
    super()
  }

  render (itemId, itemName) {
    // listId, itemId, check, name, notes, label, created, scheduled, priority) {
    let template = document.createElement('template')
    let tempStr = String.raw`
    <div class="itemV">
      <input class="status" type="checkbox"> </input>
      <p class="itemName"> ${itemName} </p>  
      <p class="itemNotes"></p>
      <input type="textarea"> </input>
    </div>
    `
    template.innerHTML = tempStr

    const shadowRoot = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')

    style.textContent = `
    div.itemV {
        padding: 20px;
        margin: 10px;
        border: 2px solid red;
        border-radius: 20px;
    }
    div.itemV:hover {
        background-color: yellow;
    }
    `
    shadowRoot.appendChild(style)
    let clone = document.importNode(template.content, true)
    let div = clone.querySelector('div')
    let statusCheckBox = clone.querySelector('input.status')
    statusCheckBox.addEventListener('click', x => {
      if (x.target.checked) console.log('checky')
      else console.log('unchecky')
    })
    div.addEventListener('click', function (e) {
      this.setAttribute('clicked', 'true')
    }.bind(this))

    shadowRoot.appendChild(clone)
  }

  connectedCallback () {
    let listId = this.getAttribute('listId')
    let itemId = this.getAttribute('itemId')
    let itemName = this.getAttribute('itemName')
    this.render(itemId, itemName)
  }
}

function renderListItems (list) {
  // listId, id, check, name, notes, label, created, scheduled, priority
  let items = list['items']
  for (let item of items) {
    console.log(item)
    let iV = document.createElement('item-card')
    iV.setAttribute('itemName', item.name)
    iV.setAttribute('itemNotes', item.notes)
    iV.setAttribute('itemLabel', item.label)
    iV.setAttribute('itemId', item.id)
    let items = document.querySelector('items')
    items.appendChild(iV)
  }
}

export { ItemCard, renderListItems }
