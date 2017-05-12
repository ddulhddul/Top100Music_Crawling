module.exports = (app)=>{
    let express = require('express')
    ,route = express.Router()

    // your code
    route.get('/', (req,res)=>{
        res.send('Hello /song/message')
    })
    
    return route
}