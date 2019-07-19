class ListAdd extends HTMLElement {
  constructor () {
    super()
  }
  render () {
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

        <button type="button">MeME </button>
      </form>
      </div>
    `
    template.innerHTML = tempStr
    let templateContent = template.content
    let shadowRoot = this.attachShadow({ mode: 'open' })
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
    let theButton = clone.querySelector('button')
    theButton.setAttribute('meme', 'momo')
    theButton.addEventListener('click', function (s) {
      console.log(shadowRoot.querySelector('#list-name'))
    })
    shadowRoot.appendChild(clone)
  }
  connectedCallback () {
    this.render()
    console.log(this.$form)
  }
  formSubmit (e) {
    console.log(e)
    return false
  }
}

export { ListAdd }
