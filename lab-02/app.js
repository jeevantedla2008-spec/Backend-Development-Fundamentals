const express = require("express");
const initializeDb = require("./database");

const app = express();

app.use(express.json());

const PORT = 3000;

let db;

const initializeDBAndServer = async () => {
  try {
    db = await initializeDb();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

app.get("/books/", async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      book;
  `;

  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});

app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const getBookQuery = `
    SELECT
      *
    FROM
      book
    WHERE
      id = ?;
  `;

  const book = await db.get(getBookQuery, [bookId]);

  if (book === undefined) {
    response.status(404);
    response.send("Book not found");
  } else {
    response.send(book);
  }
});

app.post("/books/", async (request, response) => {
  const { title, author, price, pages } = request.body;

  const addBookQuery = `
    INSERT INTO book (title, author, price, pages)
    VALUES (?, ?, ?, ?);
  `;

  await db.run(addBookQuery, [title, author, price, pages]);

  response.status(201).send("Book added successfully");
});

app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const { title, author, price, pages } = request.body;

  const updateBookQuery = `
    UPDATE book
    SET
      title = ?,
      author = ?,
      price = ?,
      pages = ?
    WHERE
      id = ?;
  `;

  const result = await db.run(updateBookQuery, [
    title,
    author,
    price,
    pages,
    bookId,
  ]);

  if (result.changes === 0) {
    response.status(404);
    response.send("Book not found");
  } else {
    response.send("Book updated successfully");
  }
});

app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const deleteBookQuery = `
    DELETE FROM
      book
    WHERE
      id = ?;
  `;

  const result = await db.run(deleteBookQuery, [bookId]);

  if (result.changes === 0) {
    response.status(404);
    response.send("Book not found");
  } else {
    response.send("Book deleted successfully");
  }
});



initializeDBAndServer();