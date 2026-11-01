const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const dbPath = require("path").join(__dirname, "books.db");

const initializeDb = async () => {
  const database = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  return database;
};

module.exports = initializeDb;