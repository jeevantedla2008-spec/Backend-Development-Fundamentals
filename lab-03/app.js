
const express = require("express");
const initializeDatabase = require("./database");

const app = express();
app.use(express.json());

let db;

const initializeDBAndServer = async () => {
  try {
    db = await initializeDatabase();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Database error: ${error.message}`);
    process.exit(1);
  }
};

// GET API - Retrieve books with search, sorting, pagination, and price filtering

app.get("/books", async (req, res) => {
  try {
    const {
      search_q = "",
      order_by = "id",
      order = "ASC",
      limit = "10",
      offset = "0",
      min_price,
      max_price,
    } = req.query;

    // Validate query parameters before building the SQL query
const numericParams = { limit, offset, min_price, max_price };

for (const [key, value] of Object.entries(numericParams)) {
  if (value !== undefined && (!Number.isFinite(Number(value)) || Number(value) < 0)) {
    return res.status(400).json({
      message: `${key} must be a valid non-negative number`,
    });
  }
}

if (Number(limit) === 0) {
  return res.status(400).json({
    message: "limit must be greater than 0",
  });
}

if (
  min_price !== undefined &&
  max_price !== undefined &&
  Number(min_price) > Number(max_price)
) {
  return res.status(400).json({
    message: "min_price cannot be greater than max_price",
  });
}
    const allowedColumns = ["id", "title", "author", "price"];
    const sortColumn = allowedColumns.includes(order_by)
      ? order_by
      : "id";

    const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    let query = "SELECT * FROM books WHERE 1 = 1";
    const values = [];

    if (search_q) {
      query += " AND title LIKE ?";
      values.push(`%${search_q}%`);
    }

    if (min_price !== undefined) {
      query += " AND price >= ?";
      values.push(Number(min_price));
    }

    if (max_price !== undefined) {
      query += " AND price <= ?";
      values.push(Number(max_price));
    }

    query += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`;
    values.push(Number(limit), Number(offset));

    const books = await db.all(query, values);

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


// GET API - Retrieve a single book using its ID
app.get("/books/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await db.get(
      "SELECT * FROM books WHERE id = ?",
      [bookId]
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST API - Add a new book with request body validation
app.post("/books", async (req, res) => {
  try {
    const { title, author, price } = req.body;

    if (
      !title ||
      !author ||
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(Number(price))
    ) {
      return res.status(400).json({
        message: "Title, author, and a valid numeric price are required",
      });
    }

    const result = await db.run(
      "INSERT INTO books (title, author, price) VALUES (?, ?, ?)",
      [title, author, Number(price)]
    );

    res.status(201).json({
      message: "Book added successfully",
      bookId: result.lastID,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


// PUT API - Update an existing book with input validation
app.put("/books/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;
    const { title, author, price } = req.body;

    if (
      !title ||
      !author ||
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(Number(price))
    ) {
      return res.status(400).json({
        message: "Title, author, and a valid numeric price are required",
      });
    }

    const result = await db.run(
      `UPDATE books
       SET title = ?, author = ?, price = ?
       WHERE id = ?`,
      [title, author, Number(price), bookId]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      message: "Book updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


// DELETE API - Remove a book using its ID
app.delete("/books/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;

    const result = await db.run(
      "DELETE FROM books WHERE id = ?",
      [bookId]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});



initializeDBAndServer();
