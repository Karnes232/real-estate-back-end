const parsePhoneNumber = require('libphonenumber-js')
const express = require('express')
const User = require('../models/user')
const House = require('../models/house')
const auth = require('../middleware/auth')
const router = express.Router()



router.post('/users', async (req, res) => {
    console.log('Hello')
    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).send({ error: "Password does not match"})
    }
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    const houses = await House.find({ owner: req.user._id })
    res.send({ user: req.user, token: req.token, houses: houses })
})

router.put('/users/me', auth, async (req, res) => {
    try { 
        const user = await User.findById(req.user._id )
        if (!user) {
            throw new Error()
        }
        user.firstName = req.body.firstName
        user.lastName = req.body.lastName
        user.email = req.body.email
        user.phoneNumber = parsePhoneNumber(req.body.phoneNumber, 'DO').formatInternational()
        await user.save()
        res.send(user)
    } catch (e) {
        if(e.name === 'CastError'){
            return res.status(400).send('Invalid id')
        }
        res.status(400).send(e)
    }
})


router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates'})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        if (!req.user) {
            return res.status(404).send()
        }
        res.send(req.user)
    } catch (e) {
        if(e.name === 'CastError'){
            return res.status(400).send('Invalid id')
        }
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) {
        //     return res.status(404).send()
        // }

        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        if(e.name === 'CastError'){
            return res.status(400).send('Invalid id')
        }
        res.status(400).send(e)
    }
})


module.exports = router