require('dotenv').config()
// requiring express 
const express = require("express")
const app = express()
const EmpRegister = require("./models/users")
const port = process.env.PORT || 3000;
require("./db/conn")
// importing the path and handlebars
const path = require("path")
const hbs = require("hbs")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const auth = require("./middleware/auth")
// defining the path of css,views path,partial path
const static_path = path.join(__dirname,"../public")
const partials_path = path.join(__dirname,"../templets/partials")
const views_path = path.join(__dirname,"../templets/views")

// middleware
app.use("/css",express.static(path.join(__dirname,"../node_modules/bootstrap/dist/css")))
app.use("/js",express.static(path.join(__dirname,"../node_modules/bootstrap/dist/js")))
app.use("/jq",express.static(path.join(__dirname,"../node_modules/jquery/dist")))

app.use(cookieParser())
app.use(express.json())
app.use(express.static(static_path))
app.use(express.urlencoded({extended:false}))
app.set("view engine","hbs")
app.set("views",views_path)
hbs.registerPartials(partials_path)

// rendering templets
app.get("/", (req,res)=>{ res.render("index")});
app.get("/secret",auth,(req,res)=>{ res.render("secret")
//  console.log(`This is jwt tokens from login ${req.cookies.jwt}`) 
});
app.get("/register" , (req,res) => { res.render("register")});
app.post("/register", async (req,res) =>{
    try {
     const password = req.body.password;
     const cpassword = req.body.cpassword;

     if(password === cpassword) {
        const createUser = new EmpRegister({
            firstname :req.body.firstname,
            lastname :req.body.lastname,
            email : req.body.email,
            age : req.body.age,
            phone : req.body.phonenumber,
            password:password,
            cpassword:cpassword
        })
        // calling the function before storing the documents for generating the tokens 
       const token =  await createUser.generateAuthToken();
    //    console.log(token)  
    //sending the jonwebtoken to the cookie show that it will ensure that the user is genune and able to login usually 
        // res.cookie("jwt", token, {expires:new Date(Date.now() + 60000),httpOnly:true})
        // const myCookieValue = req.cookies.jwt
        // console.log(myCookieValue)
        await createUser.save()
        res.status(201).render("index")
     }
    } catch (error) {
        res.status(500).send(error)
    }
});
app.get("/login",(req,res) =>{res.render("login")});
app.post("/login", async (req,res) => {
    try {
        const password = req.body.password;
        const email = req.body.email;
        
        const userEmail = await EmpRegister.findOne({email:email});
        const isMatched = await bcrypt.compare(password,userEmail.password)
        // generating the token after comparing the password and before rendering the index page which is the concept of middleware 
        const token = await userEmail.generateAuthToken();
        // console.log(token)
        // sending the jsonwebtoken to the cookie to verify the user is genune
        res.cookie("jwt", token , {
            expires:new Date(Date.now() + 60000),
            httpOnly:true
        })
        // const myCookieValue = req.cookies.jwt
        // console.log(myCookieValue)
    
        if(isMatched){
            res.status(302).render("index")
        }
        else{
            res.status(400).send("Email or password is invalid.")
        }
    
    } catch (error) {
        res.status(400).send(error)
    }
});
app.get("/logout" , auth, async(req,res)=>{
    try {
        // logout the user from the current device 
         req.user.tokens = req.user.tokens.filter((currentToken) => {
            return currentToken.token !== req.token
         })
        // sign out from all the device 
        // req.user.tokens = [];

        // removing the token from the cookie (or) logout the user 
        res.clearCookie("jwt")
        console.log("logout successfully..")
        await req.user.save()
        res.render("login")
    } catch (error) {
        res.status(500).send(error)
    }
})
app.listen(port,()=>{
    console.log(`Server is running at port ${port}`);
})