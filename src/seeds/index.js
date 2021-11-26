const mongoose = require('mongoose');
const cities = require('./cities');
const House = require('../models/house');

mongoose.connect('mongodb://localhost:27017/real-estate', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
 
const seedDB = async () => {
    await House.deleteMany({});
    for (let i = 0; i < 20; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 40) * 10000;
        const house = new House({
            title: "Beautiful two story",
            description: "Built on the flats of Punta Cana",
            propertyType: "Family House",
            bedrooms: 4,
            bathrooms: 2,
            address: '105 Street st',
            city: cities[random1000].city,
            province: cities[random1000].state,
            country: 'Dominican Republic',
            sqFoot: random1000,
            price: price,
            latitude: cities[random1000].latitude,
            longitude: cities[random1000].longitude,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            amenities: {
                aircon: true,
                balcony: false,
                dishwasher: false,
                pool: false,
                fridge: true,
                alarm: false,
                windowCover: true,
                laundry: true
            },
            owner: '615b9133da9b9ed1ce28a95f'
        })
        
        await house.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});