import express from "express";
import { isCorrectAnswer, randomQuestion } from "./questions.js";
import * as path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.get("/api/question", (req, res) => {
  const question = randomQuestion();
  res.json(question);
  res.sendStatus(200);
});

app.post("/api/question", (req, res) => {
  const { question, userAnswer } = req.body;
  const isCorrect = isCorrectAnswer(question, userAnswer);
  res.cookie("question-" + question.id, isCorrect, { signed: true });
  res.sendStatus(200);
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
