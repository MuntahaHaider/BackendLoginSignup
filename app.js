
import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
// import postModel from './models/userSchema.js';
import bcrypt from 'bcryptjs';
import userModel from './models/userSchema.js';
import cors from 'cors';


const port = process.env.PORT 
const dbUrl = process.env.DBURI

const app = express()
// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

mongoose.connect(dbUrl)

mongoose.connection.on('connected',()=>{
    console.log('monogodb connected')
})

mongoose.connection.on('error',(err)=>{
 console.log(err)
})


app.get("/", (req, res) => {
    res.send({
        message:'server up....',
        status:true
    })
})


// Signup route

app.post('/signup' , async(req,res)=>{
    const {name, email, password} = req.body
    if(!name || !email || !password){
      // status code deingy aisy res.statusCode().json
        res.json({
            message: "Please enter all fields",
            status : false
        });
        return;
    }

    const existingUser = await userModel.findOne({email});
    if(existingUser){
        res.json({
            message: "Email already exists",
            status : false
        });
        return;
    }

    // Hash the Password

    const hashedPassword = await bcrypt.hash(password,10)
    console.log("hashpassword", hashedPassword)

    
    // Create the user in the db

    const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword})
        res.json({
            message: "User registered successfully",
            status : true
        });
    
})




// Login route

app.post('/login', async(req,res)=>{
    const {email, password} = req.body
    if(!email ||!password){
        res.json({
            message: "Please enter all fields",
            status : false
        });
        return;
    }
      // Check if user exists
      const user = await userModel.findOne({email:email});
      if(!user){
        res.json({
          message: "User not found",
          status : false
        });
        return;
      }
      // Check if password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
        res.json({
          message: "Invalid password",
          status : false
        });
        return;
      }
       // Login successful
       res.json({
        message: "Login successful",
        status : true
      });
    })
     

         

         
         


    app.listen(port, () => {
      console.log(`Server start... ${port}`)
  })