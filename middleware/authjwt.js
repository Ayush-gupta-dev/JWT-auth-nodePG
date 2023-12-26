const jwt = require("jsonwebtoken")
const config= require("../config/auth.config")
const db = require("../models/index")

const User = db.user

verifyToken = (req,res,next)=>{
    let token = req.headers["x-access-token"]
    if(!token){
        return res.status(403).send({
            message: "no token provided"
        })
    }
    jwt.verify(token,config.secret,(err,decoded)=>{
        if(err){
            return res.status(401).send({message: "unauthorised"})
        }
        req.userId = decoded.id;
        next()
    })
}
isAdmin = (req,res,next)=>{
    User.findByPk(req.userId)
    .then(user=>{
        user.getRoles()
        .then(roles=>{
            for(let i =0; i<roles.length;i++){
                if(roles[i].name == "admin"){
                    return next()
                    
                }
            }
            res.status(403).send({
                message: "require asmin role"
            })
            return
        })
    })
}

isModerator = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        let isModerator = false;

        for (let i = 0; i < roles.length; i++) {
            console.log(roles[i].name);
            if (roles[i].name === "moderator") {
                isModerator = true;
                break;
            }
        }

        if (isModerator) {
            return next();
        } else {
            res.status(403).send({
                message: "not a moderator"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Internal Server Error"
        });
    }
};

isModeratorOrAdmin = async (req,res,next)=>{
   let userId = await User.findByPk(req.body.userId)
   let roles = await userId.getRoles
   for(let i=0;i<roles.length;i++){
    if(roles[i].name == "admin" || roles[i].name == "moderator"){
        next()
        return
    }
   }
   res.status(403).send({
    message : "require moderator or admin role"
   })

}

const authjwt = {
    verifyToken,
    isAdmin,
    isModerator,
    isModeratorOrAdmin
}
module.exports=authjwt