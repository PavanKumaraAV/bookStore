const express = require('express')
const User = require('./src/models/userModel')
const Book = require('./src/models/libraryModel')
const app = express()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const PORT = 3000

const jwtMiddleware = (req, res, next) => {
    console.log("Router specific middle ware");
    //get token from request headers
    const token = req.headers['verify-token']
    console.log(token);
    try {
        const data = jwt.verify(token, "superkey@123")
        console.log(data);
        req.username = data.username
        next()
    }
    catch {
        res.status(404).json({ message: "Please Login" })
    }
}


//sign up using username and password
app.post('/api/auth/register', async (req, res) => {
    let user = new User({
        username: req.body.username,
        password: req.body.password
    });
    await user.save();
    res.status(201).json({message:"deleted succesfully"})
})

//login with username and password
app.post("/api/auth/login", async (req, res) => {
    const user = await User.findOne({ username: req.body.username })
    if (!user) {
        return res.status(401).json({ message: 'Invalid Credentials' })
    } else {
        var payload = {
            id: user._id,
            username: user.username
        };
        var token = jwt.sign(payload, "superkey@123");
        res.cookie('jwToken', token)
    }
});


// change password
app.put("/api/users/:userId/changePassword", jwtMiddleware, async (req, res) => {
    const userId = req.params.userId;
    const currentUser = await User.findByIdAndUpdate(userId, { $set: { password: req.body.newPassword } },
        function (err, result) {
            if (err) {
                console.error(err);
                res.status(500).send({ message: err });
            } else {
                console.log("Updated");
                res.status(200).send({ message: "Successfully updated!" });
            }
        });
});

// api to create a book
app.post("/api/books", jwtMiddleware, async (req, res) => {
    try {

        const title = req.body.title;
        const author = req.body.author;
        const bookName = req.body.bookName;
        const category = req.body.category;
        const publishedYear = req.body.publishedYear;

        const book = new Book({
            bookName,
            author,
            title,
            category,
            publishedYear
        });
        await book.save()
            .then(() => res.status(200).send({ msg: "Book added successfully" }))
            .catch((err) => res.status(400).send({ msg: err }))
    } catch (e) {
        res.status(400).send({ message: e.message })
    }
});


// edit book
app.put('/api/books/:id', jwtMiddleware, async (req, res) => {
    try {
        let id = req.params.id;
        let update = {};
        for (let key in req.body) {
            switch (key) {
                case 'title':
                    update[key] = req.body[key];
                    break;
                case 'author':
                    update[key] = req.body[key];
                    break;
                case 'category':
                    update[key] = req.body[key];
                    break;
                case 'publishedYear':
                    update[key] = req.body[key];
                    break;
            };
        };
        console.log("update");
        console.log(update);
        await Book.findByIdAndUpdate(id, { $set: update }, function (error, result) {
            if (!error) {
                return res.status(200).json({ message: 'success',result });
            } else {
                return res.status(500).json({ message: 'failure' });
            }
        })
    } catch (e) {
        res.status(400).send({ msg: e })
    }
});




// search book based on name, author and published year
app.get("/api/search", async function (req, res) {
    const title = req.query.title || '';
    const author = req.query.author || '';
    const published_year = req.query.published_year || '';

    try {
        var query = {};
        if (title != '') {
            query['title'] = new RegExp(title, "i");
        }
        if (author != '') {
            query['author'] = new RegExp(author, "i");
        }
        if (published_year != '') {
            query['publishedYear'] = new RegExp(published_year, "i");
        }
        let result = await Book.find(query);
        if (!result) {
            res.status(400).json({message:'No Books Found'});
        } else {
            return res.status(200).json(result);
        }
    } catch (e) {
        res.status(400).send({ message: e })
    }
});


//delete a book
app.delete('/api/book/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedBook = await Book.findByIdAndDelete({ id })
        if (!deletedBook) {
            res.status(402).json({ message: `There is no book with id ${id}` })
        }
        res.status(201).json({ message: `Deletion of the book with id ${id} was successful` })
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// connecting to mongodb
    mongoose.connect('mongodb+srv://pavankumaralakulath:unni2255@cluster0.nxbjzry.mongodb.net/test?retryWrites=true&w=majority').then(() => {
        console.log("connection established")
    })

    // listening to port 
    app.listen(PORT, () => console.log(`server is running at port ${PORT} `))