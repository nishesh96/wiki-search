import "dotenv/config";
import express from "express";
import fetch from "node-fetch";
import { query, validationResult } from "express-validator";

// import morgan from "morgan";

const API_URL = "https://en.wikipedia.org/w/api.php";
const app = express();
const PORT = process.env.PORT || 3000;
const cache = new Map();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/api/search", [query("query").trim().escape()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }
  if (cache.has(query)) {
    return res.json(cache.get(query));
  }

  var params = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: query,
    format: "json",
    srsort: "relevance",
    utf8: 1,
  });

  try {
    const response = await fetch(`${API_URL}?${params}`);
    const data = await response.json();
    cache.set(query, data);
    res.json(data);
  } catch (error) {
    console.error("Error fetching data from API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
