const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
    BookName: {
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

Book = book.model('Book', bookSchema)

module.exports = Book