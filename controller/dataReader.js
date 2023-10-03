const EmpRegister = require("../src/models/users");
const bcrypt = require("bcrypt")
const ReadData = async (req,res) => {
try {
    const password = req.body.password;
    const email = req.body.email;
    
    const userEmail = await EmpRegister.findOne({email:email});
    const isMatched = await bcrypt.compare(password,userEmail.password)
    // generating the token after comparing the password and before rendering the index page which is the concept of middleware 
    const token = await userEmail.generateAuthToken();
    console.log(token)

    if(isMatched){
        res.status(302).render("index")
    }
    else{
        res.status(400).send("Email or password is invalid.")
    }

} catch (error) {
    res.status(400).send(error)
}
}

module.exports = ReadData;