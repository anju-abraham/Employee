const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const bodyparser=require('body-parser')
const { employeeModel } = require('./models/Employee')
const { signupModel } = require('./models/Signup')

const jwt=require("jsonwebtoken")


const app=express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.use(cors())

const path = require('path')
app.use(express.static(path.join(__dirname,'/build')));



//mongpdb
mongoose.connect("mongodb+srv://anjuab44:pKkKcRt9Z3j1DnQP@cluster0.vxumfkk.mongodb.net/EmployeeAppDB?retryWrites=true&w=majority",{ useNewUrlParser : true})
.then(()=>{
    console.log('Connected..mongodb connected!');})
.catch(()=>{
    console.log("error mongodb not connected")
})


app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname,'/build/index.html')); });


//signup
app.post("/api/signup",async(req,res)=>{
    console.log(req.body)

    let user=await signupModel.findOne({username:req.body.username})
    if(!user){
    let data=new signupModel(req.body)
    let result=await data.save()
    //res.json(result);
      res.json({status: 'signup  success'})
    }
    else
    res.json({status: 'username already exists'})
    })



//login 
app.post("/api/login",async(req,res)=>{
 
     //--------------------------------------------------------------------------------------------
    // if(req.body.username=="admin")
    // {
    //   if(req.body.password=="12345")
    //       res.json({status:"login success"})
    //       else
    //        res.json({status:"login failed"})
    // }
    // else{
//---------------------------------------------------------------------------------

        // let user=await signupModel.findOne({username:req.body.username})
        //  console.log(user)
        // if(!user){
        //     res.json({status:"user not found"})
        //  }
        // if (user) {
        //         if(user.password==req.body.password)
        //         {res.json({status:"login success"})}       
        //         else
        //         { res.json({status:"login failed"})}
        //         
        //     } 
        //   }
//----------------------------------------------------------------------------------------------
let user=await signupModel.findOne({username:req.body.username})
  console.log(user)
  
  if(!user)
      res.json({msg:"user not found"})
  else{
 
      if(user.password==req.body.password)
      {       
          jwt.sign({username:req.body.username,id:user._id},"empapp",{expiresIn:"1d"},
           (error,token)=>{
         //console.log("token generating")
          if(error){
              res.json({msg:"token not generated"})
          }
          else
          {
              res.json({msg:"login success",token:token,data:user,type:user.type})
          }
      }
    ) 
    }
    else{
        res.json({msg:"login failed"}) 
        }
    }
  }
)


  //post a  data -employee form
  app.post("/api/EmployeeEntry",async(req,res)=>{
            //---------------------------------------------------------------
                  // console.log(req.body)
                  // let data=new employeeModel(req.body)
                  //     let result=await data.save()
                  //     // res.json(result)
                  //     res.json({"status":"success","data":result})
              //-------------------------------------------------------------

      console.log(req.body)
      let data=new employeeModel(req.body)
        
      jwt.verify(req.body.token,"empapp",
      (error,decoded)=>{
      if(decoded && decoded.username){
          data.save()
        res.json({"status":"success"})
      }
      else{
      res.json({status:"unauthorised user"})
      }
    })})

//view all employee
app.post("/api/viewallEmployee",async(req,res)=>{
   //-------------------------------------------------------------------
    // let data=await employeeModel.find()
    // console.log(data)
    // res.json(data)
    //------------------------------------------------------------------
    let data = await employeeModel.find()
    console.log(data)
    jwt.verify(req.body.token,"empapp",
    (error,decoded)=>{
        // if (decoded && decoded.email) {
          if (decoded && decoded.username) {
            res.json(data)
            
        } else {
            res.json({status:"Unauthorized User"})
        }
    })
})

//view a employee
app.post("/api/viewallEmployee/:id",async(req,res)=>{

  try {
  
    console.log(req.params.id)
    // let id=req.body._id;      
    let id=req.params.id;    
    //console.log(id)
    let data=await employeeModel.findById({_id:id})
      console.log(data)
    res.json(data)
  }
   catch (error) {
     console.log(error)
     res.status(400).json(error.message)
 }
 
})



//delete a employee
app.delete('/api/employeelist/:id',async(req,res)=>{
    
    try{
      // let id=req.params._id; 
      let id=req.params.id;  
      //console.log(id)     
      const data=await employeeModel.findByIdAndDelete(id)
      res.status(200).json('deleted successfully')
    }        
    catch (error) {
      console.log(error)
      res.status(400).json('error')
    }
  
  })


  //update  a employee
  app.post('/api/employeelist/:id',async(req,res)=>{
 
    try {
      let item =req.body
    //let item=req.params.id
      let id=req.params.id
      //console.log(item)
    // console.log(id)
      let updateData={$set:item}
      let updatedEmp=await employeeModel.findByIdAndUpdate({_id:id},updateData,{new:true})
      //res.status(200).json(updatedEmp)
      jwt.verify(req.body.token,"empapp",
      (error,decoded)=>{
          if (decoded && decoded.username) {
              
              res.json({status:'Data Updated'})
              
          } else {
              res.json({status:"Unauthorized User"})
          }
      })
    }  
    catch (error) {
      console.log(error)
      res.status(400).json(error.message)
    }
  }) 


  app.listen(3001,()=>{
      console.log("app is running on port 3001")
  })
