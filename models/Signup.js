const mongoose=require('mongoose')
let SignupSchema=mongoose.Schema(
    {
        name:String,
        username:String,
        password:String,
       type:String

    // name: {
    //     type: String,
    //     required: true
    // },
    // username: {
    //     type: String,
    //     required: true
    // },
    // password: {
    //     type: String,
    //     required: true
    // },
    // type: {
    //     type: String,
    //     required: true
    
    }
)
var signupModel=mongoose.model("register",SignupSchema)
module.exports={signupModel}
