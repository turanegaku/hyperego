import sqlite3 from "sqlite3";

let database;

export class DBCommon {
  static init() {
    database = new sqlite3.Database("user.sqlite3");
  }
  static get() {
    return database;
  }
}

DBCommon.init();

database.run(`create table if not exists ban (
            buki text primary key
          )`);
