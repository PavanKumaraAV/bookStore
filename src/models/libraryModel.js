const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
    bookName: {
        type: string
    },
    author: {
        type: String
    },
    title: {
        type: String
    },
    category: {
        type: string
    },
    publishedYear: {

    }
})

Book = mongoose.model('Book', bookSchema)

module.exports = Book