// Response for Uptime Robot
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
app.listen(port);

app.get("/", (req, res) => {
  res.send("Discord bot is active now");
});

app.get("/img", (req, res) => {
  console.log(req.params)
  res.status(200).send('ok')
});

require("./bot");
