require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')

let notes = []

app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method, ' Path: ', request.path, ' Body: ', request.body)
  next()
}

const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => { response.json(notes) })
})

app.post('/api/notes', (request, response) => {
  const body = request.body
  if (body.content === undefined) { return response.status(400).json({ error: 'content missing' }) }
  const note = new Note({ content: body.content, important: body.important || false })
  note.save().then(savedNote => { response.json(savedNote) })
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => { response.json(note) })
})

app.delete('/api/notes/:id', (request, response) => {
  notes = notes.filter(note => note.id !== Number(request.params.id))
  response.status(204).end()
})

app.use((request, response) => { response.status(404).send({ error: 'unknown endpoint' }) })

const PORT = process.env.PORT
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) })