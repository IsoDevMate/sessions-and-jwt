const express =  require('express')
const app = express()
const port = process.env.PORT || 5003
const jwt=require('jsonwebtoken')
const cors = require('cors')
require('dotenv').config()
const posts = [{
    username:'baro',
    password:'hashed'
},
{
    username:'ake',
    password:'not_hashed'
}]
app.use(express.json())
app.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
})


 const authenticateToken = (req,res,next)=>{
const authHeader=req.headers['authorization'] //token passed in the header
const  token = authHeader && authHeader.split(' ')[1] //get 2nd token portion
if(token == null) return res.sendStatus(401) // user not sent token thus vald token

jwt.verify(token,process.env.ACCESS_TOKEN_SECRET_KEY,(err,user)=>{
    if (err) return res.sendStatus(403)//u have a token but   invalid hence no access
    req.user = user
    next()
})
 }
 app.get('/posts', authenticateToken, (req,res)=>{
    res.json(posts.filter(post =>post.username === req.user.name))//return post that user has access to 
  
})
