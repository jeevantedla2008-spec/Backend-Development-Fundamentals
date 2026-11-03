
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const dbPath = path.join(__dirname, "books.db");

const initializeDatabase = async () => {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      price INTEGER NOT NULL
    );
  `);

  const result = await db.get("SELECT COUNT(*) AS count FROM books");

  if (result.count === 0) {
    await db.run(`
      INSERT INTO books (title, author, price)
      VALUES
        ('Wings of Fire', 'A.P.J. Abdul Kalam', 250),
        ('The Alchemist', 'Paulo Coelho', 300),
        ('Atomic Habits', 'James Clear', 450),
        ('Rich Dad Poor Dad', 'Robert Kiyosaki', 350),
        ('The Psychology of Money', 'Morgan Housel', 400),
        ('Ikigai', 'Hector Garcia', 280),
        ('Deep Work', 'Cal Newport', 320),
        ('The Power of Habit', 'Charles Duhigg', 380),
        ('Think Like a Monk', 'Jay Shetty', 290),
        ('Zero to One', 'Peter Thiel', 420);
    `);
  }

  return db;
};

module.exports = initializeDatabase;
