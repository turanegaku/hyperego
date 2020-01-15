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
  constructor(name, server) {
    this.buki = name;
    this.server = server;
  }
}

const tableName = "bukis"

export default class BanTable {
  static async createTableIfNotExists() {
    const db = DBCommon.get()
    return new Promise((resolve, reject) => {
      try {
        db.serialize(() => {
          db.run(`create table if not exists ${tableName} (
            id text primary key,
            name text,
            email text
          )`)
        })
        return resolve()
      } catch (err) {
        return reject(err)
      }
    })
  }
