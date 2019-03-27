require('dotenv').config()
const express = require('express')
const mqtt = require('mqtt')
const app = express()
const isProduction = process.env.NODE_ENV === 'production'

// socket.io

const server = require('http').createServer(app)
const io = require('socket.io')(server)

// express

app.set('port', (process.env.PORT_LOCALHOST || 3000))

app.use(express.static(__dirname + '/static'))

if (!isProduction) {
  console.log(`running on http://localhost:${app.get('port')}`)
}
server.listen(app.get('port'))


// mqtt

const client =  mqtt.connect(
  process.env.HOSTNAME_MQTT_BROKER,
  {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    port: process.env.PORT_MQTT_BROKER
  }
)

client.on('connect', () => {
  client.subscribe('#')
})

io.on('connection', (socket) => {
  client.on('message', (topic, payload, message) => {
    if (!isProduction) {
      console.log('topic', topic, 'payload', payload, 'message', message)
    }
      socket.send(
        JSON.stringify(
          // convert payload buffer to string
          { topic, payload: String(payload) }
        )
      )
  })
  socket.on('message', (message) => {
    const msg = JSON.parse(message)
    const { topic, payload } = msg
    client.publish(topic, payload)
  })
})

