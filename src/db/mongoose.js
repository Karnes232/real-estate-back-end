const mongoose = require('mongoose');
const appName = 'real-estate'


mongoose.connect(`mongodb://127.0.0.1:27017/${appName}`, {
    useNewUrlParser: true
})


