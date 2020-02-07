const moment = require("moment");
const request = require("request");

let stopDate = moment().add(10, "m");
setInterval(function() {
  if (moment() >= stopDate) clearInterval(this);
  request.get("https://hyperego.glitch.me/", (err, res, body) => {
    console.log(stopDate.format());
  });
}, 1000 * 60 * 5);

module.exports.uptimereboot = () => {
  stopDate = moment().add(10, "m");
  console.log(stopDate.format());  
}
