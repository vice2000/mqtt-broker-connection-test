const socket = io()
const outputField = document.querySelector('.output')
const inputForm = document.querySelector('.form-submit')
const inputTopic = document.querySelector('.form-submit__topic')
const inputPayload = document.querySelector('.form-submit__payload')

socket.on('message', (response) => {
  const { topic, payload } = JSON.parse(response)
  outputField.insertAdjacentHTML(
    // pretty print JSON output
    "afterbegin", JSON.stringify({ topic, payload: JSON.parse(payload) }, null, 2)
  )
})

inputForm.addEventListener('submit', (e) => {
  e.preventDefault
  socket.send(JSON.stringify({topic: inputTopic.value, payload: inputPayload.value}))
})