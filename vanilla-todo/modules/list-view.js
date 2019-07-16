import { ListCard, renderListDesc }

class ListView extends HTMLElement {
  constructor() {
    super()
  }

  render(lists){
    for (list in lists){
      let lC = document.createElement('list-card')
    }
  }

  connectedCallback() {
  }
}
