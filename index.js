const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('post-data', function (req, res) {
  const name = res.body.name
  const number = res.body.number
  const data = `{name: ${name}, number: ${number}}`
  return data
})

app.use(morgan('post-data'))

let persons = [
      {
        "name": "afads dfad ",
        "number": "350925",
        "id": 2
      },
      {
        "name": "dfaf",
        "number": "3",
        "id": 8
      },
      {
        "name": "fdafdf",
        "number": "342341",
        "id": 9
      },
      {
        "name": "dfafdfa",
        "number": "32",
        "id": 10
      },
      {
        "name": "fafdf",
        "number": "2141",
        "id": 11
      },
      {
        "name": "fadf",
        "number": "32",
        "id": 12
      },
      {
        "name": "daf",
        "number": "3",
        "id": 13
      }
    ]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 10000)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  if (persons.map(p => p.name).includes(body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  console.log(person.id)

  persons = persons.concat(person)

  response.json(person)
})


app.get('/info', (request, response) => {
  const num = persons.length
  const date = new Date()
  response.end(`Phonebook has info for ${num} people. \n\n${date}`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
