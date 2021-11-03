const mongoose = require('mongoose');
const validator = require('validator')

const houseSchema = new mongoose.Schema({
    title: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    propertyType: { type: String, trim: true, required: true, enum: ['Family House', 'Apartment', 'Condo'] },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    address: { type: String, trim: true, required: true },
    city: { type: String, trim: true, required: true },
    province: { type: String, trim: true, required: true },
    country: { type: String, trim: true, required: true },
    sqFoot: { type: Number, required: true },
    price: { type: Number, required: true },
    latitude: { type: String, trim: true, required: true },
    longitude: { type: String, trim: true, required: true },
    mainImg: {
        type: Buffer
    },
    displayImgs: [{
        image: [{
            url: {
                type: String,
                trim: true
            },
            id: {
                type: String
            }      
        }]
    }],
    amenities: {
        aircon: {
            type: Boolean,
            required: true
        },
        balcony: {
            type: Boolean,
            required: true
        },
        dishwasher: {
            type: Boolean,
            required: true
        },
        pool: {
            type: Boolean,
            required: true
        },
        fridge: {
            type: Boolean,
            required: true
        },
        alarm: {
            type: Boolean,
            required: true
        },
        windowCover: {
            type: Boolean,
            required: true
        },
        laundry: {
            type: Boolean,
            required: true
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const House = mongoose.model('House', houseSchema)

module.exports = House;