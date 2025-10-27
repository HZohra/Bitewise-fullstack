// server.js
console.log("BiteWise backend is starting!");

// server.js
import express from "express"; // if this gives an error, try the version below

// --- if import doesn't work, use this instead: ---
// const express = require("express");

const app = express();

// when someone visits http://localhost:3000/
app.get("/", (req, res) => {
  res.send("Hello from BiteWise backend!");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
