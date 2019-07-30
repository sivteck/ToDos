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

    <div class="itemA">
        <input id="item-name" type="text" placeholder="Item Name">
    </div>
    <div class="itemA">
        <button type="button" id="newItem">+</button>
    </div>
      </form>
      </div>
    `
    //         <input id="item-notes" type="text" placeholder="Item Notes">
    //       <br>
    //         <input id="item-label" type="text" placeholder="Item Label">
    //       <br>
    //         <select id="item-priority">
    //           <option value="Low"> Low </option>
    //           <option value="Medium"> Medium </option>
    //           <option value="High"> High </option>
    //         </select>
    //
    //       <br>

    template.innerHTML = tempStr
    let templateContent = template.content
    const style = document.createElement('style')
    style.textContent = `
    .itemA {
        display: inline-block;
    }
    div.itemV {
        padding: 20px;
        margin: 10px;
        border: 2px solid red;
        border-radius: 20px;
    }
    input {
        width: auto;
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
    itemName.oninput = () => this.setAttribute('item-name', itemName.value)

    //     itemNotes.oninput = () => this.setAttribute('item-notes', itemNotes.value)
    //
    //     itemLabel.oninput = () => this.setAttribute('item-label', itemLabel.value)
    //
    //     itemPriority.oninput = () => {
    //       this.setAttribute('item-priority', itemPriority.value)
    //       console.log(itemPriority.value)
    //     }

    let theButton = clone.querySelector('button')
    theButton.setAttribute('meme', 'momo')
    theButton.addEventListener('click', e => {
      this.setAttribute('submitted', 'true')
    })
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
