const express = require('express');
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto');
const cors = require('cors')
const axios = require('axios')

const app = express();
app.use(bodyParser.json());
app.use(cors())

const commentsByPostId = {}
app.get('/posts/:id/comments', (req, res)=>{
    
    res.send(commentsByPostId[req.params.id] || [])
})
app.post('/posts/:id/comments', async (req, res)=>{

    const commentsId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] || []

    comments.push({id: commentsId, content, status: 'pending'})
    commentsByPostId[req.params.id] = comments
    await axios.post('http://localhost:4005/events',{
        type: 'CommentCreated',
        data:{
            id: commentsId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
        
    })
    res.status(201).send(comments)
})

app.post('/events', async (req,res)=>{
    console.log("received evnets", req.body.type)
    const { type, data} = req.body;

    if(type === 'CommentModerated'){
        const { postId, id, content, status} = data
        const comments = commentsByPostId[postId] // Get all the comments by postId:-> 'postId': [{'id': 'dsds', content},{}]
        const comment = comments.find(comment =>{
            return comment.id == id // find out particular comment from all comments by postId
        })
        comment.status = status

        await axios.post('http://localhost:4005/events',{
            type: "CommentUpdated",
            data:{
                postId,
                id,content, status
            }
        })
    }
    res.send({})
})
app.listen(4001, ()=>{
    console.log("Listing on port 4001 comment service")
})