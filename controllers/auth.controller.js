const db = require("../models/index");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    let newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    if (req.body.roles) {
      let roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles //SELECT * FROM users WHERE role IN ('admin', 'user');
          },
        },
      });
    
      await newUser.setRoles(roles);
      res.send({ message: "user registered successfully" });
    } else {
      //user role is 1
      await newUser.setRoles([1]);
      res.send({ message: "user registered succ" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};
exports.signin = async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }
    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "invalid password",
      });
    }
    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400,
    });
    let authorities = [];
    let roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }
    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
