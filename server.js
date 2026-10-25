
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.status(200).send(
        "Welcome to the Backend Development Fundamentals Lab!"
    );
});

app.get("/about", (req, res) => {
    res.status(200).json({
        name: "Tedla Jeevan Kumar",
        section: "112"
    });
});

app.get("/time", (req, res) => {
    res.status(200).json({
        currentDateTime: new Date().toString()
    });
});

app.use((req, res) => {
    res.status(404).send("404 - Route not found");
});

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`);
});
