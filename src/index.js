if(process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}


const express = require('express')
const cors = require('cors');
require('./db/mongoose')
const User = require('./models/user')

const userRouter = require('./routers/user')
const houseRouter = require('./routers/house');
const bodyParser = require('body-parser');


const app = express();
const PORT = process.env.PORT || 4000;

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is in maintenance')
// })

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(houseRouter)


app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
})

