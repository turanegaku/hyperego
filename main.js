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
  if (!query) return bukis;

  if (headers.indexOf(query) !== -1) {
    query = shuffle(
      bukis
        .map(buki => buki[query])
        .filter((x, i, self) => self.indexOf(x) === i)
    )[0];
    let ret = filter_bukis(bukis, query);
    ret.query = query;
    return ret;
  }

  let tmp;
  for (let header of headers) {
    tmp = bukis.filter(buki => buki[header] == query);
    if (tmp.length) return tmp;
  }
  tmp = bukis.filter(buki => buki["origin"].includes(query));
  if (tmp.length) return tmp;
  return [];
}

function help(channel) {
  channel.send("```\n\
random [query]: 武器ランダム\n\
  通話に参加しているユーザに武器をふりわける
  query: '' | シューター | クイックボム | スーパーチャクチ | わかば ...
  arandom [query]: 一つだけ選出
  nrandom [num] [query]: numつだけ選出
  help: helpを表示
```");
}

client.on("ready", message => {
  console.log("bot is ready!");
});

//prefixの設定
const prefix = ":";

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

  switch (command) {
    case "arandom": {
      let res = filter_bukis(bukis, args[0]);

      if (!res.length) {
        message.channel.send("ブキがみつかりませんでした");
        return;
      }
      res = shuffle(res).map(buki => buki["name"]);

      let ret = "```";
      ret += res[0];
      ret += "```";
      message.channel.send(ret);
      break;
    }
    case "nrandom": {
      let n = parseInt(args[0]);
      if (isNaN(n)) {
        help(message.channel);
        return;
      }
      let res = filter_bukis(bukis, args[1]);
      let query = res.query;

      if (!res.length) {
        message.channel.send("ブキがみつかりませんでした");
        return;
      }
      res = res.concat(res);
      while (res.length < args[0]) res = res.concat(res);
      res = shuffle(res).map(buki => buki["name"]);

      let ret = "```";
      ret += query || "";
      for (let i = 0; i < n; i++) {
        ret += `\n${res[i]}`;
      }
      ret += "```";
      message.channel.send(ret);
      break;
    }
    case "random": {
      let users = message.member.voiceChannel.members
        .map(member => member.user)
        .filter(user => !user.bot);

      let res = filter_bukis(bukis, args[0]);
      let query = res.query;

      if (!res.length) {
        message.channel.send("ブキがみつかりませんでした");
        return;
      }
      res = res.concat(res);
      while (res.length < users.length) res = res.concat(res);
      res = shuffle(res).map(buki => buki["name"]);

      let ret = "```";
      ret += query || "";
      users.forEach((user, i) => {
        ret += `\n${user.username}: ${res[i]}`;
      });
      ret += "```";
      message.channel.send(ret);
      break;
    }
    case "help":
      help(message.channel);
  }
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.log("please set ENV: DISCORD_BOT_TOKEN");
  process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);
