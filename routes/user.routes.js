const {authjwt} = require("../middleware/index")
const controller = require("../controllers/user.controllers")

module.exports= function(app){
    app.use(function(req,res,next){
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin,Content-Type,Accept"
        )
        next()
    })

    app.get("/api/test/all",controller.allAccess);
    app.get("/api/test/user",[authjwt.verifyToken],controller.userBoard)
    app.get("/api/test/admin",[authjwt.verifyToken,authjwt.isAdmin],controller.adminBoard)
    app.get("/api/test/mod",[authjwt.verifyToken,authjwt.isModerator],controller.moderatorBoard)
}