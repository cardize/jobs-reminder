const express = require('express')
const router = express.Router()

const taskdb =
    [
        {
            "id": 1,
            "priority_name": "Urgent",
            "priority_number": 1
        },
        {
            "id": 2,
            "priority_name": "Regular",
            "priority_number": 2,
        },
        {
            "id": 3,
            "priority_name": "Trivial",
            "priority_number": 3,
        },
    ]

router.get('/', (req, res) => {
    res.send(taskdb)
})

module.exports = router