const express = require("express");
const { access } = require("fs/promises");
const mongoose = require("mongoose");
const userForm = require("./model/users");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { error } = require("console");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));
app.use(cors());

// i then create my port to run app on browser

port = 8000;

// i then bing link string to connect my database to backend
mongoose
  .connect("mongodb+srv://admin:1234@cluster0.3zjxv24.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database successfully connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.post("/list", async (req, res) => {
  // when we want to catch what the user is typing or inserting
  try {
    const Salt = await bcrypt.genSalt();

    const password = await bcrypt.hash(req.body.password, Salt);

    const { name, phone, Dob, email, gender, check, country } =
      req.body;

    // when we want to push our data in the database
    const user = await userForm.create({
      name,
      phone,
      Dob,
      email,
      password,
      gender,
      check,
      country,
    });

    if (user) {
      res.status(201).json({
        status: true,
        message: "Your Account has been successfully",
        data: user,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Your account has not been created",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/getuList", async (req, res) => {
  const data = await userForm.find();

  if (data) {
    res.status(200).json({
      status: true,
      message: "Data found",
      data: data,
    });
  } else {
    res.status(400).json({
      status: false,
      message: "information could not be retrieved from database",
    });
  }
});

app.delete("/delete/:id", async (req, res) => {
  const takeOut = await userForm.findById();

  if (takeOut) {
    res.status(200).json({
      status: true,
      message: "Information has been Successfully deleted",
      data: data,
    });
  } else {
    res.status(400).json({
      status: false,
      message: "Data could not be deleted",
    });
  }
});

app.patch("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const modif = req.body;

  const edit = await userForm.updateOne(modif).where({ _id: id });

  if (edit) {
    res.status(200).json({
      status: true,
      message: "your information has been successfuly updated",
      data: data,
    });
  } else {
    res.status(400).json({
      status: false,
      message: "Could not change your information",
    });
  }
});

app.put("/add/:id", async (req, res) => {
  const { id } = req.params;
  const adding = req.body;

  const newData = await userForm.updateOne(adding).where({ _id: id });

  if (newData) {
    res.status(200).json({
      status: true,
      message: "Your new data has been successfully added and updated",
      data: data,
    });
  } else {
    res.status(400).json({
      status: false,
      message: "Your info could not be added please check error code",
    });
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  userForm.findOne({ email }).then((user) => {
    if (!user) return res.status(400).json({ message: "Invalid Email" });

    bcrypt.compare(password, user.password, (err, data) => {
      if (err) return err;

      if (data) {
        res.status(200).json({
          message: "Login Successful, Welcome User",
        });
      }
    });
  });
});

// checking connection from brwoser
app.get("/", (req, res) => {
  res.redirect(__dirname + "/index.html");
});

// i am now creating a route for my port so that database can communicate with browser

app.listen(port, () => {
  console.log("connected & Listening to port 5000 successful");
});
