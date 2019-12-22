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

let bukis;
fs.createReadStream("buki.csv").pipe(
  csv.parse({ columns: true }, (err, d) => {
    bukis = d;
  })
);

const shuffle = ([...arr]) => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
};

function filter_bukis(bukis, query) {
  if (!query) return bukis;
  let tmp;
  tmp = bukis.filter(buki => buki["type"] == query);
  if (tmp.length) return tmp;
  tmp = bukis.filter(buki => buki["sub"] == query);
  if (tmp.length) return tmp;
  tmp = bukis.filter(buki => buki["special"] == query);
  if (tmp.length) return tmp;
  tmp = bukis.filter(buki => buki["origin"] == query);
  if (tmp.length) return tmp;
  return [];
}

client.on("ready", message => {
  console.log("bot is ready!");
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

  if (command === "random") {
    let users = message.member.voiceChannel.members
      .map(member => member.user)
      .filter(user => !user.bot);

    let res = filter_bukis(bukis, args[0]).map(buki => buki["name"]);
    if (!res.length) {
      message.channel.send("ブキがみつかりませんでした");
      return;
    }
    res = res.concat(res);
    while (res.length < users.length) res = res.concat(res);
    res = shuffle(res)

    users.forEach((user, i => {
      let i = Math.floor(Math.random() * res.length)
      
    })
  }
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.log("please set ENV: DISCORD_BOT_TOKEN");
  process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);
