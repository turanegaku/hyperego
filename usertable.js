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
  constructor(id, name, main, sub, special, type) {
    this.id = id
    this.name = name
    this.main = main
    this.sub = sub
    this.special = special
    this.type = type
  }
}

export class Item {
  constructor(id, name) {
    this.id = id
    this.name = name
  }
}

export class Ban {
  constructor(id, server) {
    this.id = id
    this.server = server
  }
}

export class Table {
  static async save(user) {
    const db = DBCommon.get()
    return new Promise((resolve, reject) => {
      try {
        db.run(`insert or replace into ${userTableName} 
        (account, name, email) 
        values ($account, $name, $email)`,
          user.account, user.name, user.email
        )
        return resolve()
      } catch (err) {
        return reject(err)
      }
    })
  }
}

export default class BukiTable {
  static async createTableIfNotExists() {
    const db = DBCommon.get()
    return new Promise((resolve, reject) => {
      try {
        db.serialize(() => {
          db.run(`create table if not exists buki (
            id INTEGER PRIMARY KEY,
            name TEXT,
            main INTEGER,
            sub INTEGER,
            special INTEGER,
            type INTEGER,
          )`)
        })
        return resolve()
      } catch (err) {
        return reject(err)
      }
    })
  }
}

export class BanTable {
  static async createTableIfNotExists() {
    const db = DBCommon.get()
    return new Promise((resolve, reject) => {
      try {
        db.serialize(() => {
          db.run(`create table if not exists buki (
            account text primary key,
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
}