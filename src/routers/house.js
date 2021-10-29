const express = require('express')
const sharp = require('sharp')
const House = require('../models/house')
const auth = require('../middleware/auth')
const upload2 = require('../utils/multer')
const upload = require('../middleware/multer')
const cloudinary = require('../middleware/cloudinary')
const fs = require('fs')
const router = express.Router()

router.get('/houses', async (req, res) => {
    try {
        const houses = await House.find({})
            .sort({'date': 'desc'})
            .limit(10)
        if (!houses) {
            throw new Error()
        }
        res.send(houses)
    } catch (e) {
        res.status(404).send()
    }
})

router.post('/houses', auth, async (req, res) => {
    property = req.body.property
    amenities = req.body.amenities
    const house = new House({
        title: property.title,
        description: property.description,
        propertyType: property.propertyType,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        address: property.address,
        city: property.city,
        province: property.province,
        country: property.country,
        sqFoot: property.sqFoot,
        price: property.price,
        latitude: property.latitude,
        longitude: property.longitude,
        amenities: {
            aircon: amenities.aircon,
            balcony: amenities.balcony,
            dishwasher: amenities.dishwasher,
            pool: amenities.pool,
            fridge: amenities.fridge,
            alarm: amenities.alarm,
            windowCover: amenities.windowCover,
            laundry: amenities.laundry
        },
        owner: req.user._id
    })
    try {
        await house.save()
        res.status(201).send(house)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/photo-upload', upload.array('image'), async (req, res) => {
    const uploader = async (path) => await cloudinary.uploads(path, 'Real-Estate');
    const urls = []
    try {
        const house = await House.findById(req.body.submittedHouse)
        if (!house) {
            throw new Error()
        }
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path)
            urls.push(newPath)
            fs.unlinkSync(path)
            const image = newPath.url
            house.displayImgs = house.displayImgs.concat({ image })
            
        }
        
        await house.save()
        res.status(200).json({
            message: 'images uploaded successfully',
            data: urls
        })
    } catch (e) {
        res.status(405).send(e)
    }
    
})


router.post('/houses/photo', upload2.single('mainImg'), async (req, res, next) => {
    const buffer = await sharp(req.file.buffer)
        .resize({ width: 302, height: 227 })
        .png()
        .toBuffer()

    try {
        const house = await House.findById(req.body.submittedHouse)
        if (!house) {
            throw new Error()
        }
        house.mainImg = buffer
        await house.save()
        res.send()
    } catch (e) {
        res.status(404).send()
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


router.get('/houses/:id', async (req, res) => {
    try {
        const house = await House.findById(req.params.id)
        if (!house) {
            throw new Error()
        }
        res.send(house)
    } catch (e) {
        res.status(404).send()
    }
})

router.put('/houses/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['property', 'amenities']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
         return res.status(400).send({ error: 'Invalid updates'})
    }

    try {
        const house = await House.findById(req.params.id)
        property = req.body.property
        amenities = req.body.amenities
        if (!house) {
            throw new Error()
        }
        
        house.title = property.title
        house.description = property.description
        house.propertyType = property.propertyType
        house.bedrooms = property.bedrooms
        house.bathrooms = property.bathrooms
        house.address = property.address
        house.city = property.city
        house.province = property.province
        house.country = property.country
        house.sqFoot = property.sqFoot
        house.price = property.price
        house.latitude = property.latitude
        house.longitude = property.longitude
        house.amenities = {
                aircon: amenities.aircon,
                balcony: amenities.balcony,
                dishwasher: amenities.dishwasher,
                pool: amenities.pool,
                fridge: amenities.fridge,
                alarm: amenities.alarm,
                windowCover: amenities.windowCover,
                laundry: amenities.laundry
            },
        await house.save()
        res.send(house)
    } catch (e) {
        if(e.name === 'CastError'){
            return res.status(400).send('Invalid id')
        }
        res.status(400).send(e)
    }
})

router.put('/houses/:id/photos', auth, async (req, res) => {
    
    const deletedPhotos = req.body.active
    const newPhotoList = []
    try {
        const house = await House.findById(req.params.id)
        
        if (!house || !house.mainImg) {
            throw new Error()
        }
        
        const filteredImgs = house.displayImgs.filter((img) => {
            if (!deletedPhotos.includes(img.image)) {
                newPhotoList.push(img.image)
            }
            
        })
        house.displayImgs = []
 
        for (const photo of newPhotoList) {
            const image = photo
            house.displayImgs = house.displayImgs.concat({ image })     
        }

        await house.save()
  
        res.send()
    } catch (e) {
        res.status(404).send()
    }


})

router.get('/houses/:id/img', async (req, res) => {
    try {
        const house = await House.findById(req.params.id)

        if (!house || !house.mainImg) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(house.mainImg)
    } catch (e) {
        res.status(404).send()
    }
})

router.get('/houses/:id/:img', async (req, res) => {
    try {
        const house = await House.findById(req.params.id)

        if (!house || !house.displayImgs) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(house.displayImgs[req.params.img].image)
    } catch (e) {
        res.status(404).send()
    }
})


module.exports = router