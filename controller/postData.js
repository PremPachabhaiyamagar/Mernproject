const EmpRegister = require("../src/models/users");
  const postUserData =  async (req,res) =>{
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
       console.log(token)  
        await createUser.save()
        res.status(201).render("index")
     }
    } catch (error) {
        res.status(500).send(error)
    }
}
module.exports = postUserData;