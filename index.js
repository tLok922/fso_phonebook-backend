const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(express.json())
morgan.token('body', (request) => {
    return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status - :response-time ms :body', {
    skip: (request, response) => { return request.method !== 'POST' }
}))
const baseUrl = 'http://localhost:3001/'
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

app.get('/', (request, response) => {
    response.end();
})

//ex.3.1 get all persons
app.get('/api/persons', (request, response) => {
    response.json(persons);
})

//ex.3.2 info page
app.get('/info', (request, response) => {
    const personsCnt = persons.length;
    const currentTime = new Date();
    const message = `<p>Phonebook has ${personsCnt} person(s)</p>
    <p>Current time: ${currentTime}</p>`
    response.send(message);
})

//ex.3.3 display one person
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);
    if (person) { response.json(person); }
    else {
        response.status(404).send({ error: 'id not found' });
    }
})

//ex.3.4 delete one person
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    if (persons.some(person => person.id === id)) {
        persons = persons.filter(person => person.id === id);
        response.status(204).end()
    }
    else {
        response.status(404).send({ error: 'id not found' });
    }
})

//ex.3.5 generate id
const generateID = () => {
    return Math.floor(Math.random() * 10000000);
}

//ex.3.8 logging POST requests with morgan
// app.use(morgan(':method :url :status - :response-time ms :body'))

//ex.3.5 add new person
app.post('/api/persons', (request, response) => {
    const { name, number } = request.body;
    console.log(JSON.stringify(request.body))
    if (!number || !name) {
        response.status(404).send({ error: "Name and number cannot be empty!" });
    }
    else if (persons.some(person => person.name === name)) {
        response.status(404).send({ error: "Name already exists!" });
    }
    else {
        const newPerson = {
            "id": String(generateID()),
            name,
            number
        }
        persons = persons.concat(newPerson);
        response.status(200).end();
    }
})

//ex.3.6 error handling
// name or number missing
// name already exists

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})