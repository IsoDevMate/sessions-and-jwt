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
// authenticateToken passed as a middleware function

// ‘post’ request that sends the JWT token in the response.
app.post('/login',(req,res)=>{
    //authenticate user 
const username =req.body.username
const user ={name: username}
const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET_KEY)
res.json({accessToken:accessToken}) // accessToken will have user info
 
//const password = req.body.password
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
/* app.get("/user/validateToken", (req, res) => {
	// Tokens are generally passed in the header of the request
	// Due to security reasons.

	let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
	let jwtSecretKey = process.env.JWT_SECRET_KEY;

	try {
		const token = req.header(tokenHeaderKey);

		const verified = jwt.verify(token, jwtSecretKey);
		if(verified){
			return res.send("Successfully Verified");
		}else{
			// Access Denied
			return res.status(401).send(error);
		}
	} catch (error) {
		// Access Denied
		return res.status(401).send(error);
	}
});
*/ 


