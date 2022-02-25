import express from "express";
import { randomQuestion } from "./questions.js";
import * as path from "path";

const app = express();

app.get("/api/question", (req, res) => {
  const question = randomQuestion();
  res.json(question);
});

app.use(express.static("../client/dist"));
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api/")) {
    return res.sendFile(path.resolve("../client/dist/index.html"));
  } else {
    next();
  }
});

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Server started on http://localhost:${server.address().port}`);
});
