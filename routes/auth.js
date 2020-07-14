var express = require("express");
var bcrypt = require("bcrypt");
var bodyParser = require("../node_modules/body-parser");
const DB = require("../DButils");
var router = express.Router();

router.use(bodyParser());

router.post("/register", async (req, res) => {
  try {
    let password = req.body.password;
    const all_users = await DB.execQuery(`SELECT * FROM dbo.users`);
    if (all_users.find((x) => x.user_name === req.body.user_name))
      throw { status: 401, message: "This username had been taken !  :(" };

    //generate hash from password
    let password_hashed = bcrypt.hashSync(password, 14);
    DB.execQuery(
      `INSERT INTO [dbo].[users] (Username, FirstName, LastName, Country, Password, Email, ProfilePic) VALUES ('${req.body.user_name}','${req.body.first_name}','${req.body.last_name}','${req.body.country}','${req.body.password}','${req.body.email}','${req.body.photo_url}')`
    );
  } catch (error) {
    res.send(error);
  }

  res.status(200).send("you're registed !! :D ");
});

router.post("/login", async (req, res) => {
  try {
    const all_users = await DB.execQuery(`SELECT * FROM users`);
    if (!all_users.find((x) => x.Username === req.body.user_name))
      res.status(401).send(" Incorrect details !");
    //throw {  status : 401, message: "Incorrect details, user not found !"};

    const user = await DB.execQuery(
      `SELECT * FROM users WHERE Username =  '${req.body.user_name}'`
    );
    const password_user = bcrypt.hashSync(user[0].Password, 14);
    if (!password_user.localeCompare(req.body.password))
      res.status(401).send(" Incorrect details !");
    //throw {status : 401, message: "Incorrect Password !"};

    //succeeded:
    const bla = user[0].UserID;
    req.session.id = user[0].UserID;
    res.status(200).send(" Login Succeeded, Welcome ! :)");
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
