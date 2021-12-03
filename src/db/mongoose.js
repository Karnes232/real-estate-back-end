const mongoose = require('mongoose');
const appName = 'real-estate'


mongoose.connect(`${process.env.DB}/${appName}`, {
    useNewUrlParser: true,
})


