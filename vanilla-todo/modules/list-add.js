class ListAdd extends HTMLElement {
  constructor () {
    super()
    this.sRoot = this.attachShadow({ 'mode': 'open' })
  }
  render () {
    console.log(this.sRoot)
    let template = document.createElement('template')
    let tempStr = String.raw`
      <div class="listV">
      <form id="ListForm">
        <input id="list-name" type="text" placeholder="List Name">
      <br>
        <input id="list-desc" type="text" placeholder="List Description">
      <br>
        <input id="list-label" type="text" placeholder="List Label">
      <br>
        <input id="list-priority" type="text" placeholder="List Priority">
      <br>

        <button type="button">Add List</button>
      </form>
      </div>
    `
    template.innerHTML = tempStr
    let templateContent = template.content
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
    this.sRoot.appendChild(style)
    let clone = document.importNode(template.content, true)
    let listName = clone.querySelector('#list-name')
    let listDesc = clone.querySelector('#list-desc')
    let listLabel = clone.querySelector('#list-label')
    let listPriority = clone.querySelector('#list-priority')
    listName.oninput = function (e) {
      this.setAttribute('list-name', listName.value)
    }.bind(this)

    listDesc.oninput = function (e) {
      this.setAttribute('list-desc', listDesc.value)
    }.bind(this)

    listLabel.oninput = function (e) {
      this.setAttribute('list-label', listLabel.value)
    }.bind(this)

    listPriority.oninput = function (e) {
      this.setAttribute('list-priority', listPriority.value)
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
      console.log('lfma;')
      console.log(x)
    })
    // let observer = new MutationObserver(this.onMutations)
    // observer.observe(this.sRoot, {
    //   characterData: false,
    //   attributes: true,
    //   childList: true,
    //   subtree: true
    // })

    this.render()
  }
  formSubmit (e) {
    console.log('memem')
    return false
  }
  // onMutations (mutations) {
  //   for (let mutation of mutations) {
  //     let attrs = []
  //     if (mutation.attributeName === 'submitted') {
  //       mutation.target.parentElement.childNodes.forEach(child => {
  //         if (child.localName === 'input') attrs.push({ id: child.id, data: child.getAttribute('data') })
  //       })
  //       console.log(attrs)
  //     }
  //   }
  // }
  attributeChangedCallback (name, oldValue, newValue) {
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
    this.dispatchEvent(new CustomEvent('submitted', { detail: attrs }))
  }

  static get observedAttributes () { return ['submitted'] }
}

export { ListAdd }

//      let attrs = []
//      e.target.parentElement.childNodes.forEach(child => {
//        if (child.localName === 'input') attrs.push({ id: child.id, data: child.getAttribute('data') })
//      })
//      this.dispatchEvent(new CustomEvent('submitted', attrs))
