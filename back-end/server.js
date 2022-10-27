const express = require('express')
const app = express()

app.get("/", (req, res) => {
    res.send('Connected')
})

const useRouter = require('./routes/taskdb')

app.use("/taskdb", useRouter)

app.listen(3001, () => console.log('Server started.'))