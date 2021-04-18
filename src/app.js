const express = require('express');
const {json}=require('express');
const jwt=require('jsonwebtoken');
const hbs=require('hbs');
const auth=require('../middleware/auth');
require('./db/connection.js');
const bcrypt=require('bcryptjs');
const path=require('path');
const model=require('./models/RegistrationData');
const app = express();
const cookieperser=require('cookie-parser');

app.use(express.json());
app.use(cookieperser());
app.use(express.urlencoded({extended:false}));
const port = process.env.port||8000;
app.use(express.static(path.join(__dirname,"../public")));
app.set("view engine","hbs");
hbs.registerPartials(path.join(__dirname,'../templates/partials'));
app.get('/', (req, res) => {
    res.render('home',{name:"Home",sr:"(current)"});
});

app.get('/register', (req, res) => {
    res.render('index',{name:"Register/Login",sr:"(current)"});
});
app.get('/service',auth,(req, res) => {
    console.log(req.user);
    res.render('service',{name:req.user.firstname,logout:true});
});
app.get("/logout",auth,async(req, res) => {
    try {
        res.clearCookie('jwtlogin');
        req.user.tokens=req.user.tokens.filter((currentElement)=>{
            return currentElement.token !== req.token;
        });
        await req.user.save();
        res.render('index',{message:"logout successfully 😸😸😸😸"});
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
           
    }
});

const securepassword=async(password)=>{
    const secpass=await bcrypt.hash(password,12);
    return secpass;
}

app.post('/register',async(req,res)=>{
    try{
        // console.log(req.body.password);
        // console.log(req.body.confirmpassword);
        
        
        if(req.body.password===req.body.confirmpassword){
            const Registerdata=new model({
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                password:req.body.password,
                gender:req.body.gender,
                option:req.body.option,
                option_value:req.body.option_value,
                phonenumber:req.body.phonenumber,
                confirmpassword:req.body.confirmpassword
            });

           const token=await Registerdata.generateAuthToken();

            res.cookie("jwt",token,{
                expires:new Date(Date.now()+20000),
                httpOnly:true
            });


            const status=await Registerdata.save();
            res.status(201).send(status);
        }else{
            res.status(500).send("password are not matching");
        }        
    }catch(e){
        console.log(e);
    }
})


// const generatetoken=async(_id)=>{
//     const status=await jwt.sign({_id},"dheemanpatisayanpatibnaeladlijkeqnkwnm",{
//         expiresIn:"2 minutes"
//     });
//     return status;
// }

// const checktoken=async(token,uniquekey)=>{
//     const status=await jwt.verify(token,uniquekey);
//     console.log(status);
// }
// const token=await generatetoken(status._id);
    // const result=await checktoken(token,"dheemanpatisayanpatibnaeladlijkeqnkwnm");
    // console.log(result);

app.post('/login',async(req,res)=>{
    try{
    const email=req.body.email;
    const password=req.body.password;
    // console.log(password);
    const status= await model.findOne({email:email});
    const flag=await bcrypt.compare(password,status.password);
    const token=await status.generateAuthToken();
    res.cookie('jwtlogin',token,{
        expires:new Date(Date.now()+86400000),
        httpOnly:true
    });
    if(flag){
        res.status(200).render('home');
    }else{
        res.send("user doesnot exist 😈😈😈 ");
    }
    }catch(e){
        console.log(e);
    }
    
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
