require('dotenv').config()
// requiring express 
const express = require("express")
const app = express()
// const EmpRegister = require("./models/users")
const port = process.env.PORT || 3000;
require("./db/conn")
// controller function
const postUserData = require("../controller/postData");
const dataReader = require("../controller/dataReader");
// importing the path and handlebars
const path = require("path")
const hbs = require("hbs")
// defining the path of css,views path,partial path
const static_path = path.join(__dirname,"../public")
const partials_path = path.join(__dirname,"../templets/partials")
const views_path = path.join(__dirname,"../templets/views")

// middleware
app.use("/css",express.static(path.join(__dirname,"../node_modules/bootstrap/dist/css")))
app.use("/js",express.static(path.join(__dirname,"../node_modules/bootstrap/dist/js")))
app.use("/jq",express.static(path.join(__dirname,"../node_modules/jquery/dist")))

app.use(express.json())
app.use(express.static(static_path))
app.use(express.urlencoded({extended:false}))
app.set("view engine","hbs")
app.set("views",views_path)
hbs.registerPartials(partials_path)

// rendering templets
app.get("/", async(req,res)=>{ res.render("index")});
app.get("/register" , (req,res) => { res.render("register")});
app.post("/register",postUserData);
app.get("/login",(req,res) =>{res.render("login")});
app.post("/login",dataReader);

app.listen(port,()=>{
    console.log(`Server is running at port ${port}`);
})