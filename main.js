const csv = require("csv");
const fs = require("fs");

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

const headers = ["type", "sub", "special", "origin"];

function filter_bukis(bukis, query) {
  if (!query) return [bukis, ""];

  if (headers.indexOf(query) !== -1) {
    query = shuffle(
      bukis
        .map(buki => buki[query])
        .filter((x, i, self) => self.indexOf(x) === i)
    )[0];
    return [filter_bukis(bukis, query), query];
  }

  let tmp;
  headers.forEach(header => {
    tmp = bukis.filter(buki => buki[header] === query);
    if (tmp.length) return [tmp, ""];
  });
  return [[], ""];
}

client.on("ready", message => {
  console.log("bot is ready!");
});

//prefixの設定
const prefix = "!";

client.on("message", message => {
  //botに反応しなくなる奴
  if (message.author.bot) return;
  //argumentなどの処理
  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "arandom") {
    let res = filter_bukis(bukis, args[0]);
    let query = res[1];
    res = res[0];

    if (!res.length) {
      message.channel.send("ブキがみつかりませんでした");
      return;
    }
    res = shuffle(res).map(buki => buki["name"]);

    let ret = `${query || ""}\n${res[0]}`;
    message.channel.send(ret);
  } else if (command === "random") {
    let users = message.member.voiceChannel.members
      .map(member => member.user)
      .filter(user => !user.bot);

    let res = filter_bukis(bukis, args[0]);

    console.log(res);
    let query = res[1];
    res = res[0];

    if (!res.length) {
      message.channel.send("ブキがみつかりませんでした");
      return;
    }
    res = res.concat(res);
    while (res.length < users.length) res = res.concat(res);
    res = shuffle(res).map(buki => buki["name"]);

    let ret = query || "";
    users.forEach((user, i) => {
      ret += `\n${user.username}: ${res[i]}`;
    });
    message.channel.send(ret);
  }
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.log("please set ENV: DISCORD_BOT_TOKEN");
  process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);
