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
    if (all_users.find((x) => x.Username === req.body.user_name)) {
      res.status(401).send("This username had been taken !  :(");
    } else {
      //generate hash from password
      let password_hashed = bcrypt.hashSync(password, 10);
      DB.execQuery(
        `INSERT INTO [dbo].[users] (Username, FirstName, LastName, Country, Password, Email, ProfilePic) VALUES ('${req.body.user_name}','${req.body.first_name}','${req.body.last_name}','${req.body.country}','${password_hashed}','${req.body.email}','${req.body.photo_url}')`
      );
      res.status(200).send("you're registed !! :D ");
    }
  } catch (error) {
    res.send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const all_users = await DB.execQuery(`SELECT * FROM users`);
    if (!all_users.find((x) => x.Username === req.body.user_name)) {
      res.status(401).send(" Incorrect details !");
    } else {
      const user = await DB.execQuery(
        `SELECT * FROM users WHERE Username =  '${req.body.user_name}'`
      );
      var user_pass = user[0].Password;
      var input_pass = req.body.password;
      if (!bcrypt.compareSync(input_pass, user_pass)) {
        res.status(401).send(" Incorrect details !");
      } else {
        //succeeded:
        const bla = user[0].UserID;
        req.session.id = user[0].UserID;
        res.status(200).send(" Login Succeeded, Welcome ! :)");
      }
    }
  } catch (error) {
    res.send(error);
  }
});

router.get("/exist/:username", async (req, res) => {
  let username_input = req.params.username;
  const all_users = await DB.execQuery(`SELECT * FROM dbo.users`);
  if (all_users.find((x) => x.Username === username_input)) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
});

module.exports = router;
