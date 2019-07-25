class ListView extends HTMLElement {
  constructor () {
    super()
  }

  render (lists) {
    let template = document.createElement('template')
    let tempStr = String.raw`
      <div class="listV">
      </div>
    `
    template.innerHTML = tempStr
    console.log(template.content)

    const shadowRoot = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')

    style.textContent = `
    div.listView {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 3px;
    }
    `
    shadowRoot.appendChild(style)
  }

  connectedCallback () {
    this.render()
  }
}

export { ListView }
