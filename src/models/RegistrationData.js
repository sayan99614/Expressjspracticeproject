const mongoose=require('mongoose');
const bycrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const mongooseschema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        required:true
    },
    option:{
        type:String,
        required:true
    },
    option_value:{
        type:String,
        required:true
    },
    phonenumber:{
        type:Number,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}


//creating token 

mongooseschema.methods.generateAuthToken=async function(){
    try {
        const token=await jwt.sign({_id:this._id},'dheemanpatisayanpatifullstackdeveloper');
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
        console.log("error part is running......");
    }
}


//middleware 
mongooseschema.pre('save',async function(next){
    if(this.isModified('password')){
       this.password=await bycrypt.hash(this.password,12);
        this.confirmpassword=await bycrypt.hash(this.password,12);
    }
    
    next();
})


const Registration=new mongoose.model("PersonData",mongooseschema);

module.exports=Registration;