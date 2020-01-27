const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const moment = require("moment");
const request = require('request');


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

const bukis = parse(fs.readFileSync("buki.csv"), { columns: true });
const headers = Object.keys(bukis[0]).slice(1);

console.log(Array(3).fill([3, 2]).flat())

Array.prototype.shuffle = function() {
  let m = this.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [this[m], this[i]] = [this[i], this[m]];
  }
  return this;
};
Array.prototype.unique = function() {
  return [...new Set(this)];
};

let stopDate = moment().add(10, "m");
setInterval(function() {
  if (moment() >= stopDate) clearInterval(this);
  request.get('https://hyperego.glitch.me/', (err, res, body) => {
  console.log(body, moment());
});

}, 1000 * 60 * 3);

function help(channel) {
  channel.send(
    "```\n\
$random [query]\n\
  通話部屋にいる人で武器ランダム\n\
  query: 一番左のを指定したときはそれもランダムで決める\n\
    type | シューター | スピナー ...: 武器種類固定ランダム\n\
    sub | クイックボム | スプリンクラー...: サブ固定ランダム\n\
    special | スーパーチャクチ | ナイスダマ...: スペシャル固定ランダム\n\
    main | わかば | ハイドラ...: 派生武器のみでランダム(ex. わかば|もみじ|おちば)\n\
      (mainは部分文字列を許容する)\n\
$arandom [query]\n\
  一つだけ選出\n\
$nrandom [num] [query]\n\
  numつだけ選出\n\
$di-salmon [num] (+)\n\
  討伐禁止サーモン用\n\
$help\n\
  helpを表示\n\
```"
  );
}

function filter_bukis(bukis, query) {
  if (!query) return bukis;

  if (headers.indexOf(query) !== -1) {
    query = bukis
      .map(buki => buki[query])
      .filter((x, i, self) => self.indexOf(x) === i) // unique
      .filter(x => x != "カーボンローラー")
      .shuffle()[0];
    let ret = filter_bukis(bukis, query);
    ret.query = query;
    return ret;
  }

  let tmp;
  for (let header of headers) {
    tmp = bukis.filter(buki => buki[header] == query);
    if (tmp.length) return tmp;
  }
  tmp = bukis.filter(buki => buki["main"].includes(query));
  if (tmp.length) return tmp;
  return [];
}

function random_buki(args, message, users) {
  let res = filter_bukis(bukis, args[0]);
  let query = res.query;

  if (!res.length) {
    message.channel.send("ブキがみつかりませんでした");
    return;
  }
  let rep = Math.max(Math.ceil(users.length / res.length), 2);
  res = Array(rep)
    .fill(res)
    .flat()
    .shuffle()
    .map(buki => buki["name"]);

  let ret = `${query || ""}\n\`\`\``;
  {
    let i = 0;
    users.forEach(user => {
      if (user instanceof discord.User) {
        if (query != "カーボンローラー")
          while (user.username == "turanegaku" && res[i].includes("カーボン"))
            i++;
        ret += `\n${user.username}: ${res[i]}`;
      } else ret += `\n${res[i]}`;
      i++;
    });
  }
  ret += "```";
  message.channel.send(ret);
}

client.on("ready", message => {
  console.log("bot is ready!");
  client.user.setActivity("$help");
});

//prefixの設定
const prefix = "$";

client.on("message", message => {
  console.log(message);
  if (message.author.bot) return;
  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/\s+/g);
  const command = args.shift().toLowerCase();
  
  stopDate = moment().add(10, "m");

  switch (command) {
    case "ban": {
      break
    }
    case "arandom": {
      random_buki(args, message, [0]);
      break;
    }
    case "nrandom": {
      let n = parseInt(args[0]);
      if (isNaN(n)) {
        help(message.channel);
        return;
      }

      random_buki(args.slice(1), message, Array.from({ length: n }));
      break;
    }
    case "random": {
      if (!message.member.voiceChannel) {
        message.channel.send(
          "Voice Channelに入ってから使用するか$arandomを使用してください"
        );
        return;
      }
      let users = message.member.voiceChannel.members
        .map(member => member.user)
        .filter(user => !user.bot);

      random_buki(args, message, users);
      break;
    }
    case "di-salmon": {
      let n = parseInt(args[0]);
      if (isNaN(n)) {
        help(message.channel);
        return;
      }
      let res = [
        [0, "バクダン"],
        [1, "カタパッド"],
        [2, "テッパン"],
        [3, "ヘビ"],
        [4, "タワー"],
        [5, "モグラ"],
        [6, "コウモリ"]
      ];

      let rep = Math.max(Math.ceil(n / res.length), 3);
      res = Array(rep)
        .fill(res)
        .flat();

      if (args[1] == "+") {
        res.push([7, "納品"]);
        res.push([8, "デス"]);
        if (Math.random() < 0.5) res.push([9, "救助"]);
        if (Math.random() < 0.1) res.push([10, "赤イクラ"]);
      }

      res = res
        .shuffle()
        .slice(0, n)
        .sort()
        .map(v => v[1]);

      let ret = message.author.username + "```";
      for (let i = 0; i < n; i++) {
        ret += `\n${res[i]}`;
      }
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
