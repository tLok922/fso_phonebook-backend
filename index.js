const express = require("express");
const app = express();
app.use(express.static("dist"));
app.use(express.json());
const morgan = require("morgan");
morgan.token("body", (request) => {
  return JSON.stringify(request.body);
});
app.use(
  morgan(":method :url :status - :response-time ms :body", {
    skip: (request, response) => {
      return request.method !== "POST";
    },
  })
);

require("dotenv").config();
const Person = require("./models/person");
const baseUrl = "/api/persons";
let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.end();
});

//ex.3.1 get all persons
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

//ex.3.2 info page
app.get("/info", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      const personsCnt = persons.length;
      const currentTime = new Date();
      const message = `<p>Phonebook has ${personsCnt} person(s)</p>
        <p>Current time: ${currentTime}</p>`;
      response.send(message);
    })
    .catch((error) => next(error));
});

//ex.3.3 display one person
app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  // const person = persons.find(person => person.id === id);
  // if (person) { response.json(person); }
  // else {
  //     response.status(404).send({ error: 'id not found' });
  // }
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

//ex.3.4 delete one person
app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  // if (persons.some(person => person.id === id)) {
  //     persons = persons.filter(person => person.id === id);
  //     response.status(204).end()
  // }
  // else {
  //     response.status(404).send({ error: 'id not found' });
  // }
  Person.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

//ex.3.5 generate id
const generateID = () => {
  return Math.floor(Math.random() * 10000000);
};

//ex.3.8 logging POST requests with morgan
// app.use(morgan(':method :url :status - :response-time ms :body'))

//ex.3.5 add new person
app.post("/api/persons", (request, response,next) => {
  const { name, number } = request.body;
  console.log(JSON.stringify(request.body));
  if (!number || !name) {
    response.status(404).send({ error: "Name and number cannot be empty!" });
  } else if (persons.some((person) => person.name === name)) {
    response.status(404).send({ error: "Name already exists!" });
  } else {
    const newPerson = new Person({
      //   id: String(generateID()),
      name,
      number,
    });
    newPerson.save().then((savedPerson) => {
      response.json(savedPerson);
      persons = persons.concat(newPerson);
      // response.status(200).end();
    })
    .catch(error => next(error))
  }
});

//ex.3.6 error handling
// name or number missing
// name already exists

//ex.3.17 update a person
app.put("/api/persons/:id", (request, response, next) => {
  const { name, number, id } = request.body;
  Person.findById(request.params.id)
    .then((person) => {
      if (!person) return response.status(404).end();

      person.name = name;
      person.number = number;
      return person.save().then((updatedPerson) => {
        response.json(updatedPerson);
      });
    })
    .catch((error) => next(error));
});

const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint" });
};
app.use(unknownEndPoint);

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted ID" });
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error); //passed to the default Express handler
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
