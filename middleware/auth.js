const jwt=require('jsonwebtoken');

const Registration=require('../src/models/RegistrationData');


const auth=async(req,res,next)=>{
    try {
        const token=req.cookies.jwtlogin;
        const verifyuser=jwt.verify(token,'dheemanpatisayanpatifullstackdeveloper');
        const user=await Registration.findOne({_id:verifyuser._id});
        req.token=token;
        req.user=user;
        next();
    } catch (error) {
        console.log(error);
        res.status(404).render('index');
    }
}

module.exports=auth