function fade (div) {
  let id = div.target.getAttribute('id')
  if (id !== null) {
    let element = document.getElementById(id)
    element.style.backgroundColor = 'blue'
  }
}

function lightUp (div) {
  console.log(div)
  let id = div.target.getAttribute('id')
  if (id !== null) {
    let element = document.getElementById(id)
    element.style.backgroundColor = 'orange'
  }
}

export { fade, lightUp }
