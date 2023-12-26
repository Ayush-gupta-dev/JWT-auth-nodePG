const db = require("../models/index")

const ROLES = db.ROLES
const User = db.user

checkDuplicateUsernameOrEmail=(req,res,next) =>{
    User.findOne({
        where:{
            username: req.body.username,
        },
    })
    .then(user=>{
        if(user){
            res.status(400).send({
                message: "failed user already in use"
            });
            return
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
      });
    //email
    User.findOne({
        where:{
            email: req.body.email
        }
    })
    .then((email)=>{
        if(email){
            res.status(400).send({message:"email already exist"})
            return
        }
    })
    next()
}

checkRoleExists= (req,res,next) =>{
    if(req.body.roles){
        for(let i =0; i< req.body.roles.length;i++){
            if(!ROLES.includes(req.body.roles[i])){
                res.status(400).send({
                    message: "failed role doesn't exit" + req.bod.roles[i]
                })
                return;
            }
        }
    }
    next()
}

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRoleExists
}
module.exports = verifySignUp;