var express = require("express");
var morgan = require("./node_modules/morgan");
var bodyParser = require("./node_modules/body-parser");
var session = require("client-sessions");
var cors = require("./node_modules/cors");
//routes:
const user = require("./routes/user");
const search = require("./routes/search");
const recipes = require("./routes/recipes");
const auth = require("./routes/auth");

const app = express();
const port = process.env.PORT || "4000";

app.use(
  session({
    cookieName: "session",
    secret: "123bimbam",
    duration: 20 * 10000000,
    cookie: {
      httpOnly: false,
    },
  })
);

const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
//Vue.use(VueAxios, axios);
//axios.defaults.withCredentials = true;

app.use("/user", user);
app.use("/recipes", recipes);
app.use("/search", search);

app.use(auth);

// //parse app
// app.use(bodyParser.urlencoded({ extended : false}))

// //parse application/json
// app.use(bodyParser.json)

// //prints to the log
// app.use(morgan(":method :url :status  :response-time ms"))

// //settting cookies config:

app.get("/alive", (req, res) => {
  res.status(200).send(" i'm alive !!");
});

app.get("/", (req, res) => {
  req.session.id = "test";
  res.status(200).send("Hello World");
});

app.get((req, res) => {
  res.status(401).send(" page not found :( ");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log("api key : " + process.env.spooncular_apiKey);
});
