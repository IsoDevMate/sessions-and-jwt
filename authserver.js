const express =  require('express')
const app = express()
const port = process.env.PORT2 || 5004
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

let refreshToken = []

// authenticateToken passed as a middleware function
app.post('/token',(req,res)=>{
	const refreshToken = req.body.token
	//check if the token exists
	if(refreshToken == null) res.status(401).send('invalid token')
	//check if the token is valid
	if(!refreshToken.includes(refreshToken)) res.sendStatus(403) //no aceess rights
     jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user) =>{
		if(err) return res.status(403).send('no access rights')
		const accessToken = generateAccessToken({name: user.name})
		res.json({accessToken:accessToken})
	 })
})
// ‘post’ request that sends the JWT token in the response.
app.post('/login',(req,res)=>{
    //authenticate user 
const username =req.body.username
const user ={name: username}

const accessToken=generateAccessToken(user)
const refreshToken= jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)//HANDLE REFRESH MANUALLY

refreshToken.push(refreshToken) //record of refreshToken
res.json({accessToken:accessToken,refreshToken:refreshToken}) // accessToken will have user info
 

}) 

//create a function that generates an access tokenand expires in () seconds
const generateAccessToken= (user)=>{
	return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET_KEY,{expiresIn: '15s'})
}

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


