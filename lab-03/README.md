# Backend Development Fundamentals

## Lab 03: REST API, Query Parameters, Validation and Debugging

### Student Details

- **Name:** Tedla Jeevan Kumar
- **Registration Number:** 252U1R9159
- **Section:** CSE Gen AI 2C

---

## 1. Objective

To develop a clean REST API using Node.js, Express.js and SQLite. This lab focuses on RESTful endpoint design, query parameters, searching, sorting, pagination, price-range filtering, input validation, HTTP status codes and debugging common backend errors.

## 2. Technologies Used

- Node.js
- Express.js
- SQLite
- JavaScript
- Postman
- Visual Studio Code

## 3. Project Structure

```text
lab-03/
│
├── screenshots/
│   ├── 01-get-all-books.png
│   ├── 02-search-books.png
│   ├── 03-sorting.png
│   ├── 04-pagination.png
│   ├── 05-price-filter.png
│   ├── 06-get-book-by-id.png
│   ├── 07-post-success.png
│   ├── 08-post-validation-error.png
│   ├── 09-put-success.png
│   ├── 10-delete-success.png
│   ├── 11-not-found-error.png
│   └── 12-query-validation.png
│
├── app.js
├── database.js
├── books.db
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## 4. Installation and Setup

### Step 1: Install Dependencies

Open the terminal inside the `lab-03` directory and execute:

```bash
npm install
```

### Step 2: Start the Development Server

```bash
npm run dev
```

### Step 3: Access the Server

The application runs at:

```text
http://localhost:3000
```

### Production Start Command

```bash
npm start
```

## 5. Environment Variables

| Variable | Description | Default Value |
|---|---|---|
| PORT | Port number used by the server | 3000 |

The application uses `process.env.PORT || 3000`.

## 6. Database Description

The application uses SQLite as its database.

The `books` table contains the following columns:

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key with auto-increment |
| title | TEXT | Book title |
| author | TEXT | Book author |
| price | INTEGER | Book price |

The database is initialized automatically when the server starts. If the table is empty, sample book records are inserted.

## 7. API Endpoints

Base URL:

```text
http://localhost:3000
```

### 7.1 GET All Books

**Endpoint:** `GET /books`

Retrieves books with optional searching, sorting, pagination and price filtering.

Supported query parameters:

| Parameter | Description | Default |
|---|---|---|
| search_q | Search books by partial title | Empty |
| order_by | Column used for sorting | id |
| order | Sorting direction (ASC/DESC) | ASC |
| limit | Maximum number of records | 10 |
| offset | Number of records to skip | 0 |
| min_price | Minimum book price | Not specified |
| max_price | Maximum book price | Not specified |

Example:

```text
GET /books?search_q=the&min_price=300&max_price=450&order_by=price&order=DESC
```

### 7.2 GET a Single Book

**Endpoint:** `GET /books/:bookId`

Retrieves a specific book using its ID.

Example:

```text
GET /books/1
```

Returns `404 Not Found` if the book does not exist.

### 7.3 POST a New Book

**Endpoint:** `POST /books`

Adds a new book to the database.

Example JSON request body:

```json
{
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt",
  "price": 500
}
```

Returns:
- `201 Created` when the book is successfully added.
- `400 Bad Request` when required fields are missing or the price is invalid.

### 7.4 PUT Update a Book

**Endpoint:** `PUT /books/:bookId`

Updates an existing book using its ID.

Example:

```text
PUT /books/11
```

Example JSON request body:

```json
{
  "title": "The Pragmatic Programmer - Updated",
  "author": "Andrew Hunt",
  "price": 550
}
```

Returns:
- `200 OK` when successfully updated.
- `400 Bad Request` when the request body is invalid.
- `404 Not Found` when the book does not exist.

### 7.5 DELETE a Book

**Endpoint:** `DELETE /books/:bookId`

Deletes a book using its ID.

Example:

```text
DELETE /books/11
```

Returns:
- `200 OK` when successfully deleted.
- `404 Not Found` when the book does not exist.

## 8. Input Validation and Error Handling

The API implements validation for request bodies and query parameters.

Examples of validation include:

- Checking that title and author are provided.
- Checking that price is numeric.
- Checking that limit and offset are valid non-negative numbers.
- Ensuring limit is greater than zero.
- Ensuring minimum price does not exceed maximum price.
- Returning appropriate status codes for missing records.

Error responses use a consistent JSON message format.

Example:

```json
{
  "message": "Book not found"
}
```

## 9. HTTP Status Codes Used

| Status Code | Meaning | Usage |
|---|---|---|
| 200 | OK | Successful GET, PUT and DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input or query parameters |
| 404 | Not Found | Requested book does not exist |
| 500 | Internal Server Error | Unexpected server-side error |

## 10. Postman Testing and Screenshots

The following API operations were tested using Postman.

| Screenshot | Test Description |
|---|---|
| 01-get-all-books.png | Retrieve all books |
| 02-search-books.png | Search books using a query parameter |
| 03-sorting.png | Sort books by a selected column |
| 04-pagination.png | Test limit and offset |
| 05-price-filter.png | Filter books by price range |
| 06-get-book-by-id.png | Retrieve a book using its ID |
| 07-post-success.png | Successfully add a new book |
| 08-post-validation-error.png | Test invalid POST request |
| 09-put-success.png | Successfully update a book |
| 10-delete-success.png | Successfully delete a book |
| 11-not-found-error.png | Test a nonexistent book ID |
| 12-query-validation.png | Test invalid query parameter |

## 11. Debugging Exercises

The following common backend errors were studied as part of the lab.

### 11.1 EADDRINUSE Error

**Problem:** Occurs when the application attempts to use a port that is already occupied by another process.

**Solution:** Stop the process using the port or configure the application to use another available port.

### 11.2 Wrong Import Path

**Problem:** Occurs when a required module or local file cannot be found because the import path is incorrect.

**Solution:** Verify the file name and relative path used in the `require()` statement.

### 11.3 Table Name Typo

**Problem:** Occurs when an SQL query references a table name that does not exist in the database.

**Solution:** Check the SQL query and ensure the table name matches the actual database table.

### 11.4 Missing await

**Problem:** Occurs when an asynchronous database operation is not awaited before its result is used.

**Solution:** Use `await` with asynchronous database operations inside an async function.

## 12. REST API Concepts

- **Query Parameters:** Used to filter, search, sort and paginate data. Example: `/books?limit=5`.
- **Path Parameters:** Used to identify a particular resource. Example: `/books/1`.
- **Statelessness:** Each HTTP request contains the information required by the server to process it.
- **HTTP Status Codes:** Indicate whether a request succeeded or failed.

## 13. Deployment

**Deployment Platform:** Render

**Deployment URL:** Pending deployment.

The application will be deployed as a separate service for Lab 03.

## 14. Conclusion

This lab helped develop a RESTful API using Node.js, Express.js and SQLite. It provided practical experience with query parameters, searching, sorting, pagination, price filtering, request validation, HTTP status codes and debugging common backend errors.

Postman was used to test successful API operations and error scenarios. The lab improved understanding of REST API development and backend debugging.

---
