const config = require("./config").config;
const express = require("express");
const router = require("./src/router");
const bodyParser = require("body-parser");

const app = express();

app.use(router);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(config.PORT, (err) => {
    if (err) throw new Error(err);
    else console.log(`Server running at ${config.PORT}.`);
});