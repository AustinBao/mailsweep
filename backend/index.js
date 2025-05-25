const express = require('express')
const app = express()

//database soon
let subscriptions = [
    {
     "id": "1",
     "address": "bob@gmail.com"
    }
]

app.get('/', (request, response) => {
    response.status(200).json({
        status: 'success',
        message: 'REST APIs are working',
    })
})

app.get('/api/subscriptions', (request, response) => {
    response.json(subscriptions)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})