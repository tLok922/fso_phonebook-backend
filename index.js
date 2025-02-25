const express = require("express")
const app = express()
app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => { //exercise 3.5
    return Math.floor(Math.random() * 999999999999)
} 

app.post('/api/persons', (request,response) => { //exercise 3.5-6 - add new person entries
    const name = request.body.name
    const number = request.body.number
    if (name && number) {
        if (persons.find(p => p.name === name)){ //if name is NOT unique
            response.status(400).json({
                error: "Name already exists in the phonebook"
            });
        }
        else{
            const id = generateId()
            const newEntry = {"id": id, "name": name, "number": number}
            persons = persons.concat(newEntry)
            response.json(persons);
        }
    }
    else {
        response.status(400).json({
            error: "The name or number is missing"
        });
    }
    
})

app.delete('/api/persons/:id', (request,response) => { //exercise 3.4 - delete person with a specific id
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end() // 204 status code = successful operation with no returned content
})

app.get('/api/persons/:id', (request,response) => { //exercise 3.3 - return person with a specific id
    const id = request.params.id
    let person = persons.find(p => p.id === id)
    if (person){
        response.json(person)
    }
    else{
        response.status(404).end() // 404 status code = resource not found
    }
})

app.get('/info', (request,response) => { //exercise 3.2 - return info & received time
    let res = `Phonebook has info for ${persons.length} person(s). <br>${new Date()}`
    response.send(res);
})

app.get('/api/persons', (request,response) => { //exercise 3.1 - return all persons
    response.json(persons)
})

// initialisation (Must be included!)
app.get('/', (request, response) => { //root path
    response.send('<h1>Hello world!</h1>')
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})