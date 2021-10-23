const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: "karnes232",
    api_key: 692792735926678,
    api_secret: '5EBCc0lvcbWTRpr8h29e7pJWNEI'
})

const storage = new CloudinaryStorage ({
    cloudinary,
    params: {
        folder: 'RealEstate',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}