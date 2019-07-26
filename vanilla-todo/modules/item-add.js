class ItemAdd extends HTMLElement {
  constructor () {
    super()
    this.sRoot = this.attachShadow({ 'mode': 'open' })
  }

  render () {
    let template = document.createElement('template')
    let tempStr = String.raw`
      <div class="itemV">
      <form id="ItemForm">
        <input id="item-name" type="text" placeholder="Item Name">
      <br>
        <input id="item-notes" type="text" placeholder="Item Notes">
      <br>
        <input id="item-label" type="text" placeholder="Item Label">
        <select name="item-label">
          <option value="Low"> Low </option>
          <option value="Medium"> Medium </option>
          <option value="High"> High </option>
        </select>
      <br>
        <input id="item-priority" type="text" placeholder="Item Priority">
      <br>
        <button type="button">Add Item</button>
      </form>
      </div>
    `
    template.innerHTML = tempStr
    let templateContent = template.content
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
    this.sRoot.appendChild(style)
    let clone = document.importNode(template.content, true)
    let itemName = clone.querySelector('#item-name')
    let itemNotes = clone.querySelector('#item-notes')
    let itemLabel = clone.querySelector('#item-label')
    let itemPriority = clone.querySelector('#item-priority')
    itemName.oninput = function (e) {
      this.setAttribute('item-name', itemName.value)
    }.bind(this)

    itemNotes.oninput = function (e) {
      this.setAttribute('item-notes', itemNotes.value)
    }.bind(this)

    itemLabel.oninput = function (e) {
      this.setAttribute('item-label', itemLabel.value)
    }.bind(this)

    itemPriority.oninput = function (e) {
      this.setAttribute('item-priority', itemPriority.value)
    }.bind(this)

    let theButton = clone.querySelector('button')
    theButton.setAttribute('meme', 'momo')
    theButton.addEventListener('click', function (e) {
      this.setAttribute('submitted', 'true')
    }.bind(this))
    this.sRoot.appendChild(clone)
  }

  connectedCallback () {
    this.sRoot.addEventListener('submitted', x => {
    })
    this.render()
  }

  formSubmit (e) {
    return false
  }

  attributeChangedCallback (name, oldValue, newValue) {
    let itemName = this.getAttribute('item-name')
    let itemNotes = this.getAttribute('item-notes')
    let itemPriority = this.getAttribute('item-priority')
    let itemLabel = this.getAttribute('item-label')
    let attrs = {
      'itemId': Math.floor((Math.random() * 100)),
      'name': itemName,
      'notes': itemNotes,
      'priority': itemPriority,
      'label': itemLabel,
      'done': 'false',
      'created': Date.now()
    }
    this.dispatchEvent(new CustomEvent('submitted', { detail: attrs }))
  }

  static get observedAttributes () { return ['submitted'] }
}

export { ItemAdd }
