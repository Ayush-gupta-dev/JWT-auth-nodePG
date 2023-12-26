const express = require("express")
const cors = require("cors")
const app = express();
require("dotenv").config()
const PORT = process.env.PORT || 8080
const db =require("./models/index")
const Role = db.role;
app.use(cors(corsOption))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//routes
require("./routes/user.routes")(app)
require("./routes/auth.routes")(app)


db.sequelize.sync({force:true})
.then(()=>{
    console.log("drop and resync db")
    initial()
})

function initial(){
    Role.create({id:1,name:"user"});
    Role.create({id:2,name:"moderator"});
    Role.create({id:3,name:"admin"})
}

var corsOption = {
    origin: "http://localhost:8081"
}



app.get("/",(req,res)=>{
    res.send("Hello from server")
})



app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})