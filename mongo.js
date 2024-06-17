const mongoose = require('mongoose')

if (process.argv.length < 4) {
  console.log('give password and content as argument')
  process.exit(1)
}

const password = process.argv[2]
const content = process.argv[3]

const url =
  `mongodb+srv://fullstackopen:${password}@fullstackopen.3g4o4wp.mongodb.net/noteApp?retryWrites=true&w=majority&appName=FullStackOpen`

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
  })
  
  const Note = mongoose.model('Note', noteSchema)
  
  const note = new Note({ content: content, important: Math.random < 0.5 })
  note.save().then(() => { console.log(`saved ${[content]}`) })

  Note.find({ important: false }).then(result => {
    result.forEach(note => { console.log(note)})
    mongoose.connection.close()
  })
})
