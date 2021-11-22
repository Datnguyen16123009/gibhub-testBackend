const Mongoose = require('mongoose');
Mongoose.connect("mongodb+srv://nguyentandat:datnguyen1612@cluster0.ftwyq.mongodb.net/Database?retryWrites=true&w=majority",function(err){
  if(err){
    console.log("Connect Failed")
  }else{
    console.log("Connect Success")
  }
});
const Schema = Mongoose.Schema;
const Account = new Schema({
    Password: String,
    Name:String,
    Email:String,
    Phonenumber:String,
    Address:String,
    Emoij:String
});

const AccountModel = Mongoose.model("person",Account );
for (let i = 0; i < 20; i++) {
    try {
        const user={"Name":'ADC_'+i,
        "Password":123456,
        "Email":'ADC'+i+'@gmail.com'
    }
        var person = new AccountModel(user);
        const User = person.save();
        console.log("ThanhCong");
    } catch (error) {
        console.log(error);
    }
    
}