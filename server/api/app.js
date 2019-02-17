const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const logger = require("morgan");
const passport = require("passport");
const app = express();
const v1 = require("./routes/v1");
//--------------- DB config ---------------//
mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true
});
mongoose.connection.on("connected", () => {
  console.log("Database connected with sucess !");
});
mongoose.connection.on("error", err => {
  console.error("Database connexion failed !" + err);
});

//--------------- Middlewares ------------//
app.use(logger("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

//--------------- Routes ---------------//
app.use(v1); // app.use("/c1/q", v1); le premier parametre "un prefix optionnel" juste pour distinguer les liens de back-end des liens de front-end

// --------- Errors -------------//
//the Error-middlewares must be in the end of file and befor "module-export"

app.use((req, res, next) => {
  var err = new Error(`URL : [${req.originalUrl}] => Not found`);
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const error = err.message || "Error processing your request";
  res.status(status).send({
    error
  });
});
/** on peut aussi utiliser cette petit fct:
app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + " not found" });
});*/
//---------------Exportation---------//
module.exports = app;
