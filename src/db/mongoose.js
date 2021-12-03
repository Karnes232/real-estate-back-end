const mongoose = require('mongoose');
const appName = 'real-estate'

const dbUrl = process.env.DB_URL || `${process.env.DB}/${appName}`

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database connected");
});


