const mongoose = require("mongoose")
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
    firstname : {
      type : String,
      require : true
    },
    lastname : {
      type : String,
      require:true
    },
    email : {
      type : String,
      unique : true,
      validate : {
        validator : function(v){
          return validator.isEmail(v);
        },
        message : "User already Exists"
      }
    },
    phonenumber :{
      type:Number,
      require:true
    },
    gender : {
      type:String,
      enum:['male','female'],
      default : 'male'
    },
    age :{
      type:Number,
      require:true
    },
    password : {
      type:String,
      require:true
    },
    cpassword : {
      type: String,
      require :true
    },
    tokens :[{
      token:{
        type:String,
        require:true
      }
    }]
});

employeeSchema.methods.generateAuthToken = async function (){
 try {
  // here this._id accessing the global id 
   const token = jwt.sign({_id : this._id.toString()},process.env.SECRET_KEY);
  //  storing the token in the database 
   this.tokens = this.tokens.concat({token:token});
  //  saving the generated token
   await this.save();
   return token
 } catch (error) {
  res.send("failed to generate token" + error)
 }
}

employeeSchema.pre( "save", async function(next){
 if(this.isModified("password")){
  // hasing the password using bcrypt 
   this.password = await bcrypt.hash(this.password,10);
   this.cpassword = undefined ;
 }
 next();
})

const EmpRegister = new mongoose.model("EmpRegister",employeeSchema);
module.exports = EmpRegister;