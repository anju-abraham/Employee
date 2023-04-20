const mongoose=require('mongoose')
let EmployeeSchema=mongoose.Schema(
    {
    Name:String,
    Age:Number,
    Designation:String,
    Salary:Number
}

)
var employeeModel=mongoose.model("employee",EmployeeSchema)
module.exports={employeeModel}