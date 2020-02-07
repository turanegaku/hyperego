// Response for Uptime Robot
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
app.listen(port);

app.get("/", (req, res) => {
  res.send("Discord bot is active now");
});

app.get("/sake", (req, res) => {
  console.log(req.query)
  res.status(200).sendFile(`${__dirname}/resources/sake6.png`)
});

require("./bot");
