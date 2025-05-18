const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log(`connecting to ${url}`)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log(`error: ${error}`)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
      },
    number: {
        type: String,
        required: true,
        minLength: [8,'Phone number must have a length of 8 or more!'],
        validate: {
            validator: (v) => {
                return /^\d{2,3}-\d+$/.test(v);
            },
            message: 'Phone numbers should be formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers'
        }
      },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person',personSchema)