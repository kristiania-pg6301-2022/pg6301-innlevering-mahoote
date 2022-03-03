import express from "express";
import { isCorrectAnswer, randomQuestion } from "./questions.js";
import * as path from "path";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.get("/api/question", (req, res) => {
  const question = randomQuestion();
  res.json(question);
});

app.post("/api/question", (req, res) => {
  const { question, userAnswer } = req.body;
  const isCorrect = isCorrectAnswer(question, userAnswer);
  res.json({ answer: isCorrect });
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
