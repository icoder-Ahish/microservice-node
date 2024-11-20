const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios')
const app = express()
app.use(bodyParser.json())
app.use(cors())

app.post('/events', async (req, res)=>{
    console.log(req.body)
    const { type, data} = req.body
    if(type === "CommentCreated"){
        const status = data.content.includes('orange')?'rejected':'approved';

        await axios.post('http://localhost:4005/events',{
            type: 'CommentModerated',
            data:{
                id: data.id,
                content: data.content,
                postId: data.postId,
                status
            }
        });
    }
    res.send({})
})

app.listen(4003, ()=>{
    console.log("Listing on port moderation service 4003.....")
})
