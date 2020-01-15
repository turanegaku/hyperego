import sqlite3 from "sqlite3";

let database;

export class DBCommon {
  static init() {
    database = new sqlite3.Database("hyperego.sqlite3");
  }
  static get() {
    return database;
  }
  
}

export class Buki {
  constructor(id, name, sub, special, type, origin) {
    this.id = id
    this.name = name
    this.sub = sub
  }
}


export class Sub {
  constructor(id, name) {
    this.id = id
    this.name = name
  }
}

export class Special {
  constructor(id, name) {
    this.id = id
    this.name = name
  }
}
