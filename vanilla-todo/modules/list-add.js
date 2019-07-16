class ListAdd extends HTMLElement {
  constructor () {
    super()
  }
  render () {
    let template = document.createElement('template')
    let tempStr = String.raw`
      <div class="listV">
      <input id="list-name" type="text"> </input>
      <input id="list-desc" type="text"> </input>
      <input id="list-label" type="text"> </input>
      <input id="list-priority" type="text"> </input>
      </div>
    `
    template.innerHTML = tempStr
    let templateContent = template.content

    const shadowRoot = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')

    const input = document.createElement('input')

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
    shadowRoot.appendChild(templateContent.cloneNode(true))
  }

  onconnectedCallback () {
    this.render()
  }
}

export { ListAdd }
