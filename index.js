const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('./models/user')
require('dotenv').config()
const app = express()

app.use(cors())
app.use(express.urlencoded())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URL, {})
    .then(() => {
        console.log("Connected to mongo database")
    })
    .catch((err) => {
        console.log("Error connecting mongo database", err)
    })

const { getPosts, getPostsById, deletePost, makePost } = require('./handlers/post')
const { register, login } = require('./handlers/auth')
const { isAuthenticated } = require('./middleware/isAuthenticated')
const user = require('./models/user')

app.post('/api/makePost', makePost)
app.get('/api/getPosts', getPosts)
app.get('/api/getPosts/:id', getPostsById)
app.post('/api/deletePost', deletePost)

app.post('/api/register', register)
app.post('/api/login', login)

app.get('/api/protected', isAuthenticated, (req, res) => {
    console.log(req.user)
    res.send('got to the protected route')
})

app.post('/api/isValidToken', async (req, res) => {
    try {
        const token = req.header('jwt-token')
        if(!token) return res.json({ success: false })

        const verified = jwt.verify(token, process.env.JWT_PASSWORD)
        if (!verified) return res.json({ success: false })

        const user = await user.findById(verified.id)
        if (!user) return res.json({ success: false})

        res
            .status(200)
            .json({
                success: true,
                user: {
                    displayName: user.displayName,
                    id: user._id
                }
            })
    } catch (error) {
        res 
            .status(500)
            .json({
                success: false,
                message: err.message
            })
    }
})


app.listen(4000, (err) => {
    if (err) console.log(err)
    console.log('Connected to port 4000')
})