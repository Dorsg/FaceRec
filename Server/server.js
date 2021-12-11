const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

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

const database = {
  users: [
    {
      id: "1234",
      name: "dor",
      password: "123",
      email: "dorsabag93@gmail.com",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "1235",
      name: "noa",
      password: "123",
      email: "noa@gmail.com",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "1236",
      name: "niv",
      password: "123",
      email: "niv@gmail.com",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: {
    id: "987",
    hasd: "",
    email: "",
  },
};

db.select("*")
  .from("users")
  .then((data) => console.log(data));

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json("success");
  } else {
    res.status(400).json("error login");
  }
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

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;

  db("users")
    .returning("*")
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => res.status(400).json("unable to register"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
});

app.listen(3000, () => {
  console.log("app is running on port 3000 !!!");
});
