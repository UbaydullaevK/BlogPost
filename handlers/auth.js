const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    try {
        let { email, password, passwordCheck, displayName } = req.body

        // validation
        if (!email || !password || !passwordCheck)
            return res.status(400).json({
                success: false,
                message: 'Not all fields have been entered'
            })

            if (password.length < 5)
                return res.status(400).json({
                    success: false,
                    message: 'Password should be at least 5 characters long'
            })

        if (password !== passwordCheck)
            return res.status(400).json({
                success: false,
                message: 'Got different password'
            })


        const existingUser = await User.findOne({ email: email })
        if (existingUser)
            return res.status(400).json({
                success: false,
                message: 'User with given email already exist'
            })

        if (!displayName) displayName = email

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            email,
            password: hashedPassword,
            displayName
        })

        const user = await newUser.save()

        res.status(200).json({
            success: true,
            message: 'Successfully registered',
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { password, email } = req.body


        if (!email || !password)
            return res.status(400).json({
                success: false,
                message: 'Not all fields have been entered'
            })

            const user = await User.findOne({ email: email })
            if (!user)
                return res.status(404).json({
                    success: false,
                    message: 'Not user found with that email'
                })

                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch)
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid credentials'
                    })

                const token = jwt.sign({ id: user._id }, process.env.JWT_PASSWORD)

                res.status(200).json({
                    token,
                    user: {
                        id: user._id,
                        displayName: user.displayName
                    }
                })
    } catch (error) {
        res.status(500).json({
            success: false,
            message:err.message
        })
        
    }
}