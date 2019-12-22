// Response for Uptime Robot
const http = require("http");
http
  .createServer(function(request, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Discord bot is active now \n");
  })
  .listen(8080);

// Discord bot implements
const discord = require("discord.js");
const client = new discord.Client();

const csv = require("csv");
const fs = require("fs");

let data = fs
  .createReadStream("buki.csv")
  .pipe(csv.parse({ columns: true }))
  .on("data");

client.on("ready", message => {
  console.log("bot is ready!");
  console.log(data);
});

//prefixの設定
const prefix = "!";

client.on("message", message => {
  //botに反応しなくなる奴
  if (message.author.bot) return;
  //メンションが来たら｢呼びましたか？｣と返す
  if (message.isMemberMentioned(client.user)) {
    message.reply("呼びましたか？");
  }
  //argumentなどの処理
  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  //!pingと打ったらpong!が帰ってくる
  if (command === "random") {
    message.member.voiceChannel.members.forEach(member => {
      let user = member.user;
      console.log(user);
    });
  }
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.log("please set ENV: DISCORD_BOT_TOKEN");
  process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);
