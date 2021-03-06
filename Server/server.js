const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register.js");

// TODO : move all end point outside to controllers and test
//        if possible - change require to import

const PORT = process.env.PORT;
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "dorsabag",
    password: "",
    database: "smart-brain",
  },
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

db.select("*")
  .from("users")
  .then((data) => console.log(data));

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to ger user"));
      } else {
        res.status(400).json("wrong cred");
      }
    })
    .catch((err) => res.status(400).json("wrong cred"));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("not found");
      }
    })
    .catch((err) => res.status(400).json("error getting the user"));
});

app.post("/register", (req, res) =>
  register.handleRegister(req, res, db, bcrypt)
);

app.put("/image", (req, res) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json("unable to ger entries"));
});

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT} !!!`);
});
