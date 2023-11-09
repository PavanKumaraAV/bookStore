const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    }
})

User = mongoose.model('User', userSchema)

module.exports = User